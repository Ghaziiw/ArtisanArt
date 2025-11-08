import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { DeleteResult } from 'typeorm';
import { ChangePasswordDto, UpdateProfileDto } from './dto/update-profile.dto';
import { auth } from 'src/utils/auth';

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
 * Error handling:
 * - All methods return Promises and may reject with database or repository errors
 *   (e.g. connection issues, constraint violations). Callers should handle rejections
 *   accordingly.
 * - updateProfile throws BadRequestException for validation errors.
 *
 * Example:
 * // const users = await userService.findAll();
 * // const updatedUser = await userService.updateProfile('user-id', { name: 'John Doe' });
 */
@Injectable()
export class UserService {
  // Injection du repository UserEntity
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // Repository TypeORM pour UserEntity
  ) {}

  // Retrieve all users
  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  // Retrieve a user by ID
  findOne(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Delete a user by ID (admin function)
  async deleteUserAdmin(userId: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: userId });
  }

  // Update a user's profile
  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
  ): Promise<UserEntity> {
    const user = await this.findOne(userId);

    // Check if user exists
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify if email is being updated and is unique
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateData.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
    }

    // Merge update data into user entity
    Object.assign(user, updateData);

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
}
