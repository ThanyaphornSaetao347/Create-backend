import { IsString, MinLength, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}