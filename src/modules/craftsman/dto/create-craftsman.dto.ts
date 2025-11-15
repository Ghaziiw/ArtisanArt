import {
  IsString,
  Matches,
  IsOptional,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateCraftsmanDto {
  // User fields
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @MinLength(8, { message: 'Current password is required' })
  password: string;

  // Craftsman fields
  @IsString()
  businessName: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsString()
  @Matches(/^[1-9][0-9]{7}$/, {
    message: 'Phone number must be exactly 8 digits and cannot start with 0',
  })
  phone: string;

  @IsString()
  workshopAddress: string;

  @IsNumber()
  deliveryPrice: number;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;
}
