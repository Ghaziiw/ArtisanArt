import { IsEnum, IsString, Length, Matches, IsNotEmpty } from 'class-validator';
import { TunisianState } from '../enums/tunisian-state.enum'; // ou le fichier enum

export class PlaceOrderDto {
  @IsString()
  @Length(8, 8, { message: 'CIN must be exactly 8 digits' })
  @Matches(/^\d{8}$/, { message: 'CIN must contain only digits' })
  cin: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(TunisianState, { message: 'Invalid state' })
  state: TunisianState;

  @IsString()
  @Matches(/^\d+$/, { message: 'Phone must contain only digits' })
  @Length(8, 8, { message: 'Phone must be 8 digits' })
  phone: string;
}
