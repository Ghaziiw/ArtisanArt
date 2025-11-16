import { IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class OrderFilterDto {
  // Filtrer par statut de la commande
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  status?: OrderStatus;

  // Filtrer par artisan (craftsmanId)
  @IsOptional()
  @IsString()
  craftsmanName?: string;

  // Date de création minimum
  @IsOptional()
  @IsDateString({}, { message: 'createdAtMin must be a valid ISO date string' })
  createdAtMin?: string;

  // Date de création maximum
  @IsOptional()
  @IsDateString({}, { message: 'createdAtMax must be a valid ISO date string' })
  createdAtMax?: string;
}
