import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Product } from '../product/product.entity';
import { UpdateOfferDto } from './dto/update-offer.dto';

/**
 * Service for managing offers.
 * This service provides methods to create, retrieve, update, and delete offers
 * using a TypeORM repository for persistence.
 *
 * @remarks
 * - All methods return Promises and may reject with database or repository errors.
 * - Validation errors throw BadRequestException, NotFoundException, or ForbiddenException as appropriate.
 *
 * Constructor:
 * @param offerRepository - Injected TypeORM repository for OfferEntity used for all persistence operations.
 * @param productRepository - Injected TypeORM repository for ProductEntity used for validating products.
 *
 * Methods:
 * - findAll(): Retrieve all offers.
 * - findOne(productId: string): Retrieve an offer by its associated product identifier.
 * - createOffer(offerData: CreateOfferDto, userId: string): Create a new offer.
 * - updateOffer(productId: string, offerData: UpdateOfferDto, userId: string): Update an existing offer.
 * - deleteOffer(productId: string, userId: string): Delete an offer by its associated product identifier.
 *
 * Error handling:
 * - All methods return Promises and may reject with database or repository errors
 *   (e.g. connection issues, constraint violations). Callers should handle rejections
 *   accordingly.
 * - createOffer and updateOffer throw BadRequestException for validation errors.
 * - createOffer, updateOffer, and deleteOffer throw NotFoundException if the offer or product is not found.
 * - createOffer, updateOffer, and deleteOffer throw ForbiddenException if the user lacks permission.
 */
@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>, // Repository TypeORM pour Offer
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, // Repository TypeORM pour Product
  ) {}

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findOne(productId: string): Promise<Offer | null> {
    return this.offerRepository.findOneBy({ productId });
  }

  // Create a new offer
  async createOffer(offerData: CreateOfferDto, userId: string): Promise<Offer> {
    const product = await this.productRepository.findOneBy({
      id: offerData.productId,
    });

    // Verify product exists
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Verify user permission
    if (product.artisanId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to create an offer for this product',
      );
    }

    const existingOffer = await this.offerRepository.findOneBy({
      productId: offerData.productId,
    });

    // Check if an offer for this product already exists
    if (existingOffer) {
      throw new ForbiddenException('An offer for this product already exists');
    }

    const startDate = new Date(offerData.startDate);
    const endDate = offerData.endDate ? new Date(offerData.endDate) : null;

    // Validate dates
    if (endDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const offer = this.offerRepository.create({
      ...offerData,
      product,
    });

    return this.offerRepository.save(offer);
  }

  // Update an existing offer
  async updateOffer(
    productId: string,
    offerData: UpdateOfferDto,
    userId: string,
  ): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { productId },
      relations: ['product'],
    });

    // Verify offer exists
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    // Verify user permission
    if (offer.product.artisanId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this offer',
      );
    }

    const startDate = offerData.startDate
      ? new Date(offerData.startDate)
      : null;
    const endDate = offerData.endDate ? new Date(offerData.endDate) : null;

    // Validate dates
    if (endDate && startDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    Object.assign(offer, offerData);
    return this.offerRepository.save(offer);
  }

  // Delete an offer
  async deleteOffer(productId: string, userId: string): Promise<string> {
    const offer = await this.offerRepository.findOne({
      where: { productId },
      relations: ['product'],
    });

    // Verify offer exists
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    // Verify user permission
    if (offer.product.artisanId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this offer',
      );
    }

    await this.offerRepository.delete({ productId });

    return 'Offer deleted successfully';
  }
}
