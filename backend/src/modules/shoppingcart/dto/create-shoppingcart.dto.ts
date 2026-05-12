import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateShoppingcartDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity?: number;
}
