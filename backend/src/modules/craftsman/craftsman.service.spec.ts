import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UploadService } from '../upload/upload.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { DeleteResult } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Craftsman } from './craftsman.entity';
import { CraftsmanService } from './craftsman.service';

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
  clone: jest.fn().mockReturnThis(),

  getMany: jest.fn(),
  getCount: jest.fn(),
};

const mockCraftsmanRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

const mockUserRepository = {
  findOne: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

const mockUploadService = {
  deleteFile: jest.fn(),
  validateFile: jest.fn(),
  getFileByUrl: jest.fn(),
};

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    login: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));

describe('CraftsmanService', () => {
    let service: CraftsmanService;
    beforeEach(async () => {
        mockCraftsmanRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            CraftsmanService,
            {
            provide: getRepositoryToken(User),
            useValue: mockUserRepository,
            },
            {
            provide: UploadService,
            useValue: mockUploadService,
            },
            {
            provide: getRepositoryToken(Craftsman),
            useValue: mockCraftsmanRepository,
            },
        ],
        }).compile();
        service = module.get<CraftsmanService>(CraftsmanService);
        jest.clearAllMocks();
    });

    //findOneById
    describe('findOneById', () => {
        it('should return a craftsman by its user id', async() => {
            const craftsman = { userId: '123' } as Craftsman;
            mockCraftsmanRepository.findOne.mockResolvedValue(craftsman);

            const result = await service.findOneByUserId('123');
            expect(result).toEqual(craftsman);

        })

        it('should throw NotFoundException when craftsman does not exist', async () => {
            mockCraftsmanRepository.findOne.mockResolvedValue(null);

            await expect(service.findOneByUserId('x'))
            .rejects.toThrow(NotFoundException);
            });
    })

    //update a craftsman
    describe('updateCraftsman', () => {
    it('should update a craftsman successfully', async () => {
    const craftsman = {
      userId: '1',
      user: { email: 'old@example.com' },
    };

    mockCraftsmanRepository.findOne.mockResolvedValue(craftsman);
    mockUserRepository.findOne.mockResolvedValue(null); 

    mockUserRepository.save.mockResolvedValue(null);
    mockCraftsmanRepository.save.mockResolvedValue(null);

    await service.updateCraftsman('123', { email: 'new@example.com' });

    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockCraftsmanRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if craftsman not found', async () => {
        mockCraftsmanRepository.findOne.mockResolvedValue(null);

        await expect(
        service.updateCraftsman('123', {})
        ).rejects.toThrow(BadRequestException);
     });
    })

    //delete a craftsman
    describe('deleteCraftsman', () => {
    it('should delete craftsman and revert user role', async () => {
    const craftsman = {
      userId: '1',
      user: { role: 'artisan' },
    } as any;

    mockCraftsmanRepository.findOne.mockResolvedValue(craftsman);
    mockCraftsmanRepository.remove.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(null);

    const res = await service.deleteCraftsman('1');

    expect(mockCraftsmanRepository.remove).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(res).toEqual({ message: 'Craftsman deleted successfully' });
  });

  it('should throw BadRequestException if craftsman not exists', async () => {
    mockCraftsmanRepository.findOne.mockResolvedValue(null);

    await expect(service.deleteCraftsman('1'))
      .rejects.toThrow(BadRequestException);
    });

    })

    //update a craftsman's expiration date
    describe('updateCraftsmanExpDate', () => {
        it('should update expiration date', async () => {
        const craftsman = { userId: '1' };
        mockCraftsmanRepository.findOne.mockResolvedValue(craftsman);
        mockCraftsmanRepository.save.mockResolvedValue(craftsman);

        const res = await service.updateCraftsmanExpDate('1', {
        newExpDate: '2025-12-06',
        });

        expect(mockCraftsmanRepository.save).toHaveBeenCalled();
        expect(res).toBe(craftsman);
        });

        it('should throw BadRequestException if craftsman not found', async () => {
            mockCraftsmanRepository.findOne.mockResolvedValue(null);

            await expect(
            service.updateCraftsmanExpDate('id', { newExpDate: '2025-12-06' })
            ).rejects.toThrow(BadRequestException);
        });

    })
});