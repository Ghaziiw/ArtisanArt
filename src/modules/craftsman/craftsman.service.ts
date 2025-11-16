import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Craftsman } from '../craftsman/craftsman.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { CreateCraftsmanDto } from './dto/create-craftsman.dto';
import { auth } from 'src/utils/auth';
import { UpdateCraftsmanDto } from '../craftsman/dto/update-craftsman.dto';
import { UpdateCraftsmanExpDateDto } from './dto/update-craftsman-exp-date.dto';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CraftsmanFilterDto } from './dto/craftsman-filter.dto';

/**
 * Service responsible for managing craftsman records using a TypeORM repository.
 *
 * This service provides basic CRUD-like operations for the CraftsmanEntity within
 * the application database. It delegates persistence to an injected
 * Repository<CraftsmanEntity> instance and manages associated user data.
 *
 * @remarks
 * - Authentication and management of real authentication users is handled by
 *   the external "Better Auth" module. This service should be used for
 *   application-level craftsman records and related data, not for authentication
 *   credential management.
 *
 * Constructor:
 * @param craftsmanRepository - Injected TypeORM repository for CraftsmanEntity used for all persistence operations.
 * @param userRepo - Injected TypeORM repository for UserEntity used for managing associated user data.
 *
 * Methods:
 * - findAll(): Retrieve all craftsman records with their associated user data.
 *   @returns Promise that resolves to an array of CraftsmanEntity objects.
 *
 * - createCraftsman(craftsmanDto: CreateCraftsmanDto): Create a new craftsman along with the associated user.
 *   @param craftsmanDto - DTO containing the details of the craftsman to create.
 *   @returns Promise that resolves to the created CraftsmanEntity instance.
 *   @throws BadRequestException if user creation fails or craftsman creation fails.
 *
 * - findOneByUserId(userId: string): Retrieve a craftsman by user ID.
 *   @param userId - The identifier of the user whose craftsman record to retrieve.
 *   @returns Promise that resolves to the matched CraftsmanEntity or null if not found.
 *
 * - updateCraftsman(userId: string, updatedData: UpdateCraftsmanDto): Update a craftsman and associated user profile.
 *   @param userId - The identifier of the craftsman to update.
 *   @param updatedData - DTO containing the fields to update.
 *   @returns Promise that resolves to the updated CraftsmanEntity instance.
 *   @throws BadRequestException if craftsman is not found or if email is already in use.
 *
 * - deleteCraftsman(userId: string): Delete a craftsman by user ID.
 *   @param userId - The identifier of the craftsman to delete.
 *   @returns Promise that resolves to a message indicating the deletion outcome.
 *   @throws BadRequestException if craftsman is not found.
 *
 * - updateCraftsmanExpDate(userId: string, newExpDate: Date | null): Update craftsman's expiration date.
 *   @param userId - The identifier of the craftsman whose expiration date to update.
 *   @param newExpDate - The new expiration date to set.
 *   @returns Promise that resolves to the updated CraftsmanEntity instance.
 *   @throws BadRequestException if craftsman is not found.
 *
 * Error handling:
 * - All methods return Promises and may reject with database or repository errors
 *   (e.g. connection issues, constraint violations). Callers should handle rejections
 *   accordingly.
 * - createCraftsman, updateCraftsman, and updateCraftsmanExpDate throw BadRequestException for validation errors.
 *
 * Example:
 * // const craftsmen = await craftsmanService.findAll();
 * // const newCraftsman = await craftsmanService.createCraftsman(craftsmanDto);
 * // const updatedCraftsman = await craftsmanService.updateCraftsman('user-id', updatedData);
 * // await craftsmanService.deleteCraftsman('user-id');
 */
@Injectable()
export class CraftsmanService {
  constructor(
    @InjectRepository(Craftsman)
    private readonly craftsmanRepository: Repository<Craftsman>, // Repository TypeORM for Craftsman
    @InjectRepository(User)
    private userRepo: Repository<User>, // Repository TypeORM for User
  ) {}

  // Retrieve all craftsmen with their associated user data
  async findAll(
    page: number,
    limit: number,
    filters: CraftsmanFilterDto,
    isAdmin = false,
  ): Promise<Pagination<Craftsman, IPaginationMeta>> {
    const qb = this.craftsmanRepository.createQueryBuilder('craftsman');

    // --- Filter by business name ---
    if (filters.businessName) {
      qb.andWhere('craftsman.businessName LIKE :businessName', {
        businessName: `%${filters.businessName}%`,
      });
    }

    // --- Filter by specialty ---
    if (filters.specialty) {
      qb.andWhere('craftsman.specialty LIKE :specialty', {
        specialty: `%${filters.specialty}%`,
      });
    }

    // --- Filter by expiration date range ---
    if (filters.expirationDateMin && isAdmin) {
      qb.andWhere('craftsman.expirationDate >= :expMin', {
        expMin: filters.expirationDateMin,
      });
    }
    if (filters.expirationDateMax && isAdmin) {
      qb.andWhere('craftsman.expirationDate <= :expMax', {
        expMax: filters.expirationDateMax,
      });
    }

    return await paginate<Craftsman>(qb, {
      page,
      limit,
    });
  }

  // Create a new craftsman along with the associated user
  async createCraftsman(craftsmanDto: CreateCraftsmanDto) {
    const user = await auth.api.signUpEmail({
      body: {
        email: craftsmanDto.email,
        password: craftsmanDto.password,
        name: craftsmanDto.name,
        location: craftsmanDto.location,
        image: craftsmanDto.profileImage,
      },
    });

    const createdUser = await this.userRepo.findOne({
      where: { id: user.user?.id },
    });

    if (!createdUser)
      throw new BadRequestException('User not found after creation');

    // Change role to artisan
    createdUser.role = 'artisan';
    await this.userRepo.save(createdUser);

    // Create the Craftsman with the user relation
    try {
      const craftsman = this.craftsmanRepository.create({
        user: createdUser,
        businessName: craftsmanDto.businessName,
        bio: craftsmanDto.bio,
        specialty: craftsmanDto.specialty,
        phone: craftsmanDto.phone,
        workshopAddress: craftsmanDto.workshopAddress,
        deliveryPrice: craftsmanDto.deliveryPrice,
        instagram: craftsmanDto.instagram,
        facebook: craftsmanDto.facebook,
        profileImage: craftsmanDto.profileImage,
      });

      // Save the Craftsman entity
      const savedCraftsman = await this.craftsmanRepository.save(craftsman);
      return savedCraftsman;
    } catch {
      // If craftsman creation fails, rollback user creation
      await this.userRepo.delete({ id: createdUser.id }); // Rollback user creation
      throw new BadRequestException('Craftsman not created');
    }
  }

  // Retrieve a craftsman by user ID
  async findOneByUserId(userId: string, withUser = false): Promise<Craftsman> {
    const craftsman = await this.craftsmanRepository.findOne({
      where: { userId },
      relations: withUser ? ['user'] : [],
    });
    if (!craftsman) {
      throw new NotFoundException('Craftsman not found');
    }
    return craftsman;
  }

  // Update a craftsman and associated user profile
  async updateCraftsman(userId: string, updatedData: UpdateCraftsmanDto) {
    const craftsman = await this.craftsmanRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    // Verify craftsman exists
    if (!craftsman) {
      throw new BadRequestException('Craftsman not found');
    }

    // Verify email uniqueness if it's being updated
    if (updatedData.email && updatedData.email !== craftsman.user.email) {
      const existingUser = await this.userRepo.findOne({
        where: { email: updatedData.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
      craftsman.user.email = updatedData.email;
    }

    // Update user profile fields
    if (updatedData.name) craftsman.user.name = updatedData.name;
    if (updatedData.location) craftsman.user.location = updatedData.location;
    if (updatedData.profileImage)
      craftsman.user.image = updatedData.profileImage;

    // Update craftsman-specific fields
    Object.assign(craftsman, {
      businessName: updatedData.businessName ?? craftsman.businessName,
      bio: updatedData.bio ?? craftsman.bio,
      specialty: updatedData.specialty ?? craftsman.specialty,
      phone: updatedData.phone ?? craftsman.phone,
      workshopAddress: updatedData.workshopAddress ?? craftsman.workshopAddress,
      instagram: updatedData.instagram ?? craftsman.instagram,
      facebook: updatedData.facebook ?? craftsman.facebook,
      deliveryPrice: updatedData.deliveryPrice ?? craftsman.deliveryPrice,
      profileImage: updatedData.profileImage ?? craftsman.profileImage,
    });

    // Save both user and craftsman entities
    try {
      await this.userRepo.save(craftsman.user);
      await this.craftsmanRepository.save(craftsman);
    } catch {
      throw new BadRequestException('Failed to update craftsman');
    }

    // Return the updated craftsman with user data
    return this.craftsmanRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  // Delete a craftsman by user ID
  async deleteCraftsman(userId: string) {
    const craftsman = await this.craftsmanRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    // Verify craftsman exists
    if (!craftsman) throw new BadRequestException('Craftsman not found');

    await this.craftsmanRepository.remove(craftsman);

    // Update role back to user
    craftsman.user.role = 'client';
    await this.userRepo.save(craftsman.user);

    return { message: 'Craftsman deleted successfully' };
  }

  // Update craftsman's expiration date
  async updateCraftsmanExpDate(
    userId: string,
    newExpDate: UpdateCraftsmanExpDateDto,
  ) {
    const craftsman = await this.craftsmanRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    // Verify craftsman exists
    if (!craftsman) throw new BadRequestException('Craftsman not found');

    craftsman.expirationDate = newExpDate.newExpDate
      ? new Date(newExpDate.newExpDate)
      : null;
    await this.craftsmanRepository.save(craftsman);

    return craftsman;
  }
}
