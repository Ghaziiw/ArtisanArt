import { Test, TestingModule } from '@nestjs/testing';
import { Offer } from './offer.entity';
import { OfferService } from './offer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

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

const mockOfferRepository = {
  findOneBy: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

const mockProductRepository = {
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    login: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));

describe('CommentService', () => {
  let service: OfferService;
  beforeEach(async () => {
    mockOfferRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferService,
        {
          provide: getRepositoryToken(Offer),
          useValue: mockOfferRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();
    service = module.get<OfferService>(OfferService);
    jest.clearAllMocks();
  });

  //retrieve all offers
  describe('findAll', () => {
    it('should return all offers', async () => {
      const offers = [{ id: '1' }];
      mockOfferRepository.find.mockResolvedValue(offers);

      expect(await service.findAll()).toEqual(offers);
    });
  });

  //get a certain offer
  describe('findOne', () => {
    it('should return one offer', async () => {
      const offer = { id: '1', productId: 'p1' };
      mockOfferRepository.findOneBy.mockResolvedValue(offer);

      expect(await service.findOne('p1')).toEqual(offer);
    });
  });

  //create an offer
  describe('createOffer', () => {
    it('should throw NotFoundException when product does not exist', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.createOffer(
          {
            productId: 'p1',
            startDate: '2024',
            percentage: 20,
          },
          'u1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not owner', async () => {
      mockProductRepository.findOneBy.mockResolvedValue({
        id: 'p1',
        craftsmanId: 'OTHER',
      });

      await expect(
        service.createOffer(
          {
            productId: 'p1',
            startDate: '2024',
            percentage: 0,
          },
          'u1',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if offer already exists', async () => {
      mockProductRepository.findOneBy.mockResolvedValue({
        id: 'p1',
        craftsmanId: 'u1',
      });
      mockOfferRepository.findOneBy.mockResolvedValue({ id: 'existing' });

      await expect(
        service.createOffer(
          {
            productId: 'p1',
            startDate: '2024',
            percentage: 0,
          },
          'u1',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if end date < start date', async () => {
      mockProductRepository.findOneBy.mockResolvedValue({
        id: 'p1',
        craftsmanId: 'u1',
      });

      mockOfferRepository.findOneBy.mockResolvedValue(null);

      const dto = {
        productId: 'p1',
        startDate: '2024-01-10',
        endDate: '2024-01-01',
        percentage: 20,
      };

      await expect(service.createOffer(dto, 'u1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  //update an offer
  describe('updateOffer', () => {
    it('should update an offer successfully', async () => {
      const offer = {
        productId: 'p1',
        product: { craftsmanId: 'u1' },
      };

      mockOfferRepository.findOne.mockResolvedValue(offer);
      mockOfferRepository.save.mockResolvedValue({ ...offer, discount: 20 });

      const result = await service.updateOffer('p1', { percentage: 20 }, 'u1');

      expect(result.percentage).toBe(20);
    });

    it('should throw NotFoundException if offer does not exist', async () => {
      mockOfferRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateOffer('p1', { percentage: 20 }, 'u1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user not owner', async () => {
      mockOfferRepository.findOne.mockResolvedValue({
        product: { craftsmanId: 'OTHER' },
      });

      await expect(
        service.updateOffer('p1', { percentage: 20 }, 'u1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  //delete an offer
  describe('deleteOffer', () => {
    it('should delete offer successfully', async () => {
      mockOfferRepository.findOne.mockResolvedValue({
        productId: 'p1',
        product: { craftsmanId: 'u1' },
      });

      const result = await service.deleteOffer('p1', 'u1');

      expect(result).toBe('Offer deleted successfully');
      expect(mockOfferRepository.delete).toHaveBeenCalledWith({
        productId: 'p1',
      });
    });

    it('should throw NotFoundException when deleting non-existing offer', async () => {
      mockOfferRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteOffer('p1', 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user not owner when deleting', async () => {
      mockOfferRepository.findOne.mockResolvedValue({
        product: { craftsmanId: 'OTHER' },
      });

      await expect(service.deleteOffer('p1', 'u1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
