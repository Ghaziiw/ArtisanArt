import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';
import { ChangePasswordDto, UpdateProfileDto } from './dto/update-profile.dto';
import { auth } from 'src/utils/auth';
import {
  paginate,
  Pagination,
  IPaginationOptions,
  IPaginationMeta,
} from 'nestjs-typeorm-paginate';
import { CreateProfileDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';

/**
 * Service responsible for managing user records using a TypeORM repository.
 *
 * This service provides basic CRUD-like operations for the UserEntity within
 * the application database. It delegates persistence to an injected
 * Repository<UserEntity> instance.
 *
 * @remarks
 * - Authentication and management of real authentication users is handled by
 *   the external "Better Auth" module. This service should be used for
 *   application-level user records and related data, not for authentication
 *   credential management.
 *
 * Constructor:
 * @param userRepository - Injected TypeORM repository for UserEntity used for all persistence operations.
 *
 * Methods:
 * - findAll(): Retrieve all user records.
 *   @returns Promise that resolves to an array of UserEntity objects.
 *
 * - findOne(id: string): Retrieve a single user by its identifier.
 *   @param id - The identifier of the user to retrieve.
 *   @returns Promise that resolves to the matched UserEntity or null if no user is found.
 *
 * - deleteUserAdmin(userId: string): Delete a user record by ID (admin function).
 *   @param userId - The identifier of the user to delete.
 *   @returns Promise that resolves to a DeleteResult indicating the deletion outcome.
 *
 * - updateProfile(userId: string, updateData: UpdateProfileDto): Update a user's profile.
 *   @param userId - The identifier of the user to update.
 *   @param updateData - DTO containing the fields to update.
 *   @returns Promise that resolves to the updated UserEntity instance.
 *   @throws BadRequestException if user is not found or if email is already in use.
 *
 * - changePassword(userId: string, passwordData: ChangePasswordDto, headers: Record<string, string>): Change a user's password.
 *   @param userId - The identifier of the user whose password is being changed.
 *   @param passwordData - DTO containing current and new password.
 *   @param headers - Token headers for authentication with Better Auth API.
 *   @returns Promise that resolves when password is successfully changed.
 *   @throws BadRequestException if user is not found, passwords are the same, or password change fails.
 *
 * Error handling:
 * - All methods return Promises and may reject with database or repository errors
 *   (e.g. connection issues, constraint violations). Callers should handle rejections
 *   accordingly.
 * - updateProfile and changePassword throw BadRequestException for validation errors.
 *
 * Example:
 * // const users = await userService.findAll();
 * // const updatedUser = await userService.updateProfile('user-id', { name: 'John Doe' });
 * // await userService.changePassword('user-id', { currentPassword: 'old', newPassword: 'new' }, headers);
 */
@Injectable()
export class UserService {
  // Injection du repository User
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Repository TypeORM pour User
  ) {}

  // Retrieve all users
  async findAll(
    page: number,
    limit: number,
    filters: UserFilterDto,
  ): Promise<Pagination<User, IPaginationMeta>> {
    const options: IPaginationOptions = { page, limit };

    const qb = this.userRepository.createQueryBuilder('user');

    // --- Email LIKE ---
    if (filters.email)
      qb.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });

    // --- Name LIKE ---
    if (filters.name)
      qb.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
    // --- Role égal ---
    if (filters.role) qb.andWhere('user.role = :role', { role: filters.role });

    // --- createdAt >= createdAtMin ---
    if (filters.createdAtMin)
      qb.andWhere('user.createdAt >= :minDate', {
        minDate: filters.createdAtMin,
      });

    // --- createdAt <= createdAtMax ---
    if (filters.createdAtMax)
      qb.andWhere('user.createdAt <= :maxDate', {
        maxDate: filters.createdAtMax,
      });

    qb.orderBy('user.createdAt', 'DESC');

    return paginate<User>(qb, options);
  }

  // Retrieve a user by ID
  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Delete a user by ID (admin function)
  async deleteUserAdmin(userId: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: userId });
  }

  // Update a user's profile
  async updateProfile(
    userId: string,
    updatedData: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.findOne(userId);

    // Check if user exists
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify if email is being updated and is unique
    if (updatedData.email && updatedData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updatedData.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
    }

    // Merge update data into user entity
    Object.assign(user, updatedData);

    // Save changes to TypeORM
    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

  // Change user password
  async changePassword(
    userId: string,
    passwordData: ChangePasswordDto,
    headers: Record<string, string>, // Token headers for authentication
  ) {
    const user = await this.findOne(userId);

    // Check if user exists
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Ensure new password is different from old password
    if (passwordData.currentPassword === passwordData.newPassword) {
      throw new BadRequestException(
        'New password must be different from the old password',
      );
    }

    try {
      // Call Better Auth API to change password
      await auth.api.changePassword({
        headers: headers, // Ajoutez ceci
        body: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      });
    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : 'Failed to change password';
      throw new BadRequestException(message);
    }
  }

  // Create a new user
  async createAdminUser(userData: CreateProfileDto): Promise<User> {
    const user = await auth.api.signUpEmail({
      body: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        location: userData.location,
        image: userData.image,
      },
    });

    const createdUser = await this.userRepository.findOne({
      where: { id: user.user?.id },
    });

    if (!createdUser)
      throw new BadRequestException('User not found after creation');

    createdUser.role = 'admin';
    await this.userRepository.save(createdUser);

    return createdUser;
  }
}
