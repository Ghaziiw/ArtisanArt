import { Min, Max, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class UpdateOfferDto {
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Percentage must be at least 0' })
  @Max(100, { message: 'Percentage cannot exceed 100' })
  percentage?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
