import { IsDateString, IsOptional } from 'class-validator';

export class UpdateCraftsmanExpDateDto {
  @IsOptional()
  @IsDateString()
  newExpDate: string | null;
}
