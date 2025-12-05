import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UploadService } from '../upload/upload.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    login: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));

describe('UserController', () => {
  let controller: UserController;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let uploadService: Partial<Record<keyof UploadService, jest.Mock>>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'testuser',
    image: '',
    location: '',
    role: 'admin',
    createdAt: new Date(2025, 10, 30, 14, 45, 0),
    updatedAt: new Date(2025, 10, 30, 14, 45, 0),
  };

  beforeEach(async () => {
    userService = {
      findAll: jest.fn().mockResolvedValue({
        items: [mockUser],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 20,
          totalPages: 1,
          currentPage: 1,
        },
      }),
      findOne: jest.fn().mockResolvedValue(mockUser),
      updateProfile: jest.fn().mockResolvedValue(mockUser),
      changePassword: jest.fn().mockResolvedValue(undefined),
      deleteUser: jest.fn().mockResolvedValue({ affected: 1 } as DeleteResult),
      createAdminUser: jest.fn().mockResolvedValue(mockUser),
      updateProfileImage: jest.fn().mockResolvedValue(mockUser),
      deleteProfileImage: jest.fn().mockResolvedValue(mockUser),
    };

    uploadService = {
      validateFile: jest.fn(),
      getFileUrl: jest.fn().mockReturnValue('http://example.com/profile.jpg'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: UploadService, useValue: uploadService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return paginated users', async () => {
      const result = await controller.getAll(1, 20, {});
      expect(result.items).toHaveLength(1);
      expect(userService.findAll).toHaveBeenCalledWith(1, 20, {});
    });
  });

  describe('getMyProfile', () => {
    it('should return current user', async () => {
      const result = await controller.getMyProfile({ id: '1' } as any);
      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateMyProfile', () => {
    it('should update profile', async () => {
      const dto: UpdateProfileDto = { name: 'newname' };
      const result = await controller.updateMyProfile({ id: '1' } as any, dto);
      expect(result).toEqual(mockUser);
      expect(userService.updateProfile).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('getOne', () => {
    it('should return a user by ID', async () => {
      const result = await controller.getOne('1');
      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      userService.findOne!.mockResolvedValueOnce(null);
      const result = await controller.getOne('nonexistent');
      expect(result).toBeNull();
      expect(userService.findOne).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('deleteMyProfile', () => {
    it('should delete current user', async () => {
      const result = await controller.deleteMyProfile({ id: '1' } as any);
      expect(result).toEqual({ affected: 1 });
      expect(userService.deleteUser).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteUser', () => {
    it('should delete user by ID', async () => {
      const result = await controller.deleteUser('1');
      expect(result).toEqual({ affected: 1 });
      expect(userService.deleteUser).toHaveBeenCalledWith('1');
    });
    it('should throw error if user not found', async () => {
      userService.deleteUser!.mockRejectedValueOnce(
        new Error('User not found'),
      );
      await expect(controller.deleteUser('nonexistent')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('updateUser', () => {
    it('should update user by ID', async () => {
      const dto: Partial<UpdateProfileDto> = { name: 'adminUpdated' };
      const result = await controller.updateUser('1', dto);
      expect(result).toEqual(mockUser);
      expect(userService.updateProfile).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('createAdminUser', () => {
    it('should create admin user', async () => {
      const dto: CreateProfileDto = {
        email: 'admin@example.com',
        name: 'admin',
        password: 'pass',
        location: 'Tunis',
        image: '',
      };
      const result = await controller.createAdminUser(dto);
      expect(result).toEqual(mockUser);
      expect(userService.createAdminUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteMyProfileImage', () => {
    it('should delete profile image', async () => {
      const result = await controller.deleteMyProfileImage({ id: '1' } as any);
      expect(result).toEqual(mockUser);
      expect(userService.deleteProfileImage).toHaveBeenCalledWith('1');
    });
  });
});
