import { PartialType } from '@nestjs/mapped-types';
import { CreateCraftsmanDto } from './create-craftsman.dto';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
  Matches,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UpdateCraftsmanDto extends PartialType(CreateCraftsmanDto) {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[1-9][0-9]{7}$/, {
    message: 'Phone number must be exactly 8 digits and cannot start with 0',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  workshopAddress?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Instagram must be a valid URL' })
  instagram?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Facebook must be a valid URL' })
  facebook?: string;

  @IsOptional()
  @IsNumber()
  deliveryPrice?: number;

  @IsOptional()
  @IsString()
  profileImage?: string;
}
