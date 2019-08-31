import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginDTO {
  @ValidateIf(o => !o.username || o.username === '')
  @IsEmail()
  email: string;

  @ValidateIf(o => !o.email || o.email === '')
  @IsString()
  username: string;

  @IsString()
  password: string;
}
