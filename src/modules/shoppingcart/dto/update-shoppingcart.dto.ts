import { IsNumber, Min } from 'class-validator';

export class UpdateShoppingcartDto {
  @IsNumber()
  @Min(0, { message: 'Quantity must be at least 0' })
  quantity: number;
}
