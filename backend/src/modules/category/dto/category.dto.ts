import { IsString, MinLength } from 'class-validator';

export class CategoryDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;
}
