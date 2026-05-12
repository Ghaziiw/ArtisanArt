import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
