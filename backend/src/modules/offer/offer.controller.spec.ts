import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import type { AuthUser } from 'src/auth/types/auth-user';
import { CraftsmanExpirationGuard } from 'src/auth/guards/craftsman-expiration.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Craftsman } from '../craftsman/craftsman.entity';

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    login: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));
const mockCraftsmanGuard = {
  canActivate: jest.fn().mockReturnValue(true),
};
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
  create: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};
describe('OfferController', () => {
  let controller: OfferController;
  let service: OfferService;

  const mockUser: AuthUser = {
    id: 'u1',
    email: 'user@example.com',
    role: 'artisan',
  };

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    createOffer: jest.fn(),
    updateOffer: jest.fn(),
    deleteOffer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferController],
      providers: [
        { provide: OfferService, useValue: mockService },
        { provide: CraftsmanExpirationGuard, useValue: mockCraftsmanGuard },
        {
          provide: getRepositoryToken(Craftsman),
          useValue: mockCraftsmanRepository,
        },
      ],
    })
      .overrideGuard(CraftsmanExpirationGuard)
      .useValue(mockCraftsmanGuard)
      .compile();
    controller = module.get(OfferController);
    service = module.get(OfferService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //retrieve all offers
  describe('findAll', () => {
    it('should return all offers', async () => {
      mockService.findAll.mockResolvedValue([{ id: 'o1' }]);

      expect(await controller.findAll()).toEqual([{ id: 'o1' }]);
    });
  });

  //get a certain offer
  describe('findOne', () => {
    it('should return one offer by productId', async () => {
      mockService.findOne.mockResolvedValue({ id: 'o1' });

      expect(await controller.findOne('p1')).toEqual({ id: 'o1' });
    });
  });

  //create an offer
  describe('createOffer', () => {
    it('should create an offer', async () => {
      const dto = { productId: 'p1', startDate: '2024', percentage: 20 };

      mockService.createOffer.mockResolvedValue({ id: 'o1', ...dto });

      expect(await controller.create(mockUser, dto)).toEqual({
        id: 'o1',
        ...dto,
      });
      expect(mockService.createOffer).toHaveBeenCalledWith(dto, 'u1');
    });
  });

  //delete an offer
  describe('deleteOffer', () => {
    it('should delete an offer', async () => {
      mockService.deleteOffer.mockResolvedValue('Offer deleted successfully');

      expect(await controller.delete('p1', mockUser)).toBe(
        'Offer deleted successfully',
      );

      expect(mockService.deleteOffer).toHaveBeenCalledWith('p1', 'u1');
    });
  });
});
