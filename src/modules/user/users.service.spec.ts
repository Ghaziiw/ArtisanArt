import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UploadService } from '../upload/upload.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { DeleteResult } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

const mockQueryBuilder: any = {
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  cache: jest.fn().mockReturnThis(),
  clone: jest.fn().mockImplementation(function () {
    return this; // retourne le même objet pour que paginate fonctionne
  }),
  getMany: jest.fn(),
  getCount: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

const mockUploadService = {
  deleteFile: jest.fn(),
};

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    login: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should apply filters', async () => {
      (paginate as jest.Mock).mockResolvedValue({
        items: [{ id: 1, name: 'Mayssa', email: 'mayssa@example.com' }],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });

      const filters = {
        email: 'mayssa@example.com',
        name: 'John Doe',
      };

      const result = await service.findAll(1, 10, filters);

      expect(result.items.length).toBe(1);
      expect(paginate).toHaveBeenCalled();
    });

    it('should work without filters', async () => {
      (paginate as jest.Mock).mockResolvedValue({
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      });

      const result = await service.findAll(1, 10, {});

      expect(result.items).toEqual([]);
      expect(paginate).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: '1', name: 'Mayssa', email: 'mayssa@example.com' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow('User not found');
  });
});


  describe('delete', () => {
    it('should delete a user without image', async () => {
      const userId = '1';
      const mockUser = { id: userId, image: null };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue({
        affected: 1,
      } as DeleteResult);

      const result = await service.deleteUserAdmin(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUploadService.deleteFile).not.toHaveBeenCalled();
      expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual({ affected: 1 });
    });

    it('should delete a user with image', async () => {
      const userId = '2';
      const mockUser = { id: userId, image: 'profile.jpg' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue({
        affected: 1,
      } as DeleteResult);
      mockUploadService.deleteFile.mockResolvedValue(undefined);

      const result = await service.deleteUserAdmin(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUploadService.deleteFile).toHaveBeenCalledWith('profile.jpg');
      expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw BadRequestException if user not found', async () => {
      const userId = '999';
      mockUserRepository.findOne.mockResolvedValue(undefined);

      await expect(service.deleteUserAdmin(userId)).rejects.toThrow('User not found');

    });

    describe('update profile', () => {
      it('should update user profile when data is valid', async () => {
        const userId = '1';
        const updatedData = { name: 'New', email: 'new@mail.com' };
        const existingUser = {
          id: userId,
          name: 'Old',
          email: 'old@mail.com',
        };

        mockUserRepository.findOne
          .mockResolvedValueOnce(existingUser) //simulate searching for the user
          .mockResolvedValueOnce(null); //simulate searching for the email
        mockUserRepository.save.mockResolvedValue({
          ...existingUser,
          ...updatedData,
        });

        const result = await service.updateProfile(userId, updatedData);

        expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(1, {
          where: { id: userId },
        });

        expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(2, {
          where: { email: updatedData.email },
        });

        expect(mockUserRepository.save).toHaveBeenCalledWith({
          ...existingUser,
          ...updatedData,
        });
        expect(result.name).toBe(updatedData.name);
        expect(result.email).toBe(updatedData.email);
      });

      it('should throw BadRequestException if user not found', async () => {
        const userId = '1';
        const updatedData = { name: 'New Name', email: 'new@mail.com' };

        mockUserRepository.findOne.mockResolvedValue(undefined);

        await expect(
          service.updateProfile(userId, updatedData),
        ).rejects.toThrow(BadRequestException);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException if email is already in use', async () => {
        const userId = '1';
        const updatedData = { email: 'existing@mail.com' };
        const existingUser = {
          id: userId,
          name: 'Old Name',
          email: 'old@mail.com',
        };

        mockUserRepository.findOne
          .mockResolvedValueOnce(existingUser)
          .mockResolvedValueOnce({ id: '1', email: 'existing@mail.com' });

        await expect(
          service.updateProfile(userId, updatedData),
        ).rejects.toThrow(BadRequestException);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
      });
    });
  });
});
