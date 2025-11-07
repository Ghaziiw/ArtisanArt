import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { DeleteResult } from 'typeorm/browser';

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
 *   @returns Promise that resolves to the matched UserEntity or undefined if no user is found.
 *
 * - create(userData: Partial<UserEntity>): Create and persist a new user record.
 *   @param userData - Partial fields used to create a new UserEntity.
 *   @returns Promise that resolves to the persisted UserEntity instance.
 *
 * Error handling:
 * - All methods return Promises and may reject with database or repository errors
 *   (e.g. connection issues, constraint violations). Callers should handle rejections
 *   accordingly.
 *
 * Example:
 * // const users = await userService.findAll();
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
}
