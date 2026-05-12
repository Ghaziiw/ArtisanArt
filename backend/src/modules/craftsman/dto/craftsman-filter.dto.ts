import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CraftsmanFilterDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsDateString()
  expirationDateMin?: string;

  @IsOptional()
  @IsDateString()
  expirationDateMax?: string;
}
