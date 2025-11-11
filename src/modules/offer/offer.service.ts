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

@Injectable()
export class OffersService {
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

  async createOffer(offerData: CreateOfferDto, userId: string): Promise<Offer> {
    const product = await this.productRepository.findOneBy({
      id: offerData.productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.artisanId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to create an offer for this product',
      );
    }

    const existingOffer = await this.offerRepository.findOneBy({
      productId: offerData.productId,
    });

    if (existingOffer) {
      throw new ForbiddenException('An offer for this product already exists');
    }

    const startDate = new Date(offerData.startDate);
    const endDate = offerData.endDate ? new Date(offerData.endDate) : null;

    if (endDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const offer = this.offerRepository.create({
      ...offerData,
      product,
    });

    return this.offerRepository.save(offer);
  }

  async updateOffer(
    productId: string,
    offerData: UpdateOfferDto,
    userId: string,
  ): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { productId },
      relations: ['product'],
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.product.artisanId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this offer',
      );
    }

    const startDate = offerData.startDate
      ? new Date(offerData.startDate)
      : null;
    const endDate = offerData.endDate ? new Date(offerData.endDate) : null;

    if (endDate && startDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    Object.assign(offer, offerData);
    return this.offerRepository.save(offer);
  }

  async deleteOffer(productId: string, userId: string): Promise<string> {
    const offer = await this.offerRepository.findOne({
      where: { productId },
      relations: ['product'],
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.product.artisanId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this offer',
      );
    }

    await this.offerRepository.delete({ productId });

    return 'Offer deleted successfully';
  }
}
