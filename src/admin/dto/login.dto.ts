import {
  IsEmail,
  IsOptional,
  IsString,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { Default } from 'sequelize-typescript';

export class LoginDTO {
  @ValidateIf(o => !o.username || o.username === '')
  @IsEmail()
  email: string;

  @ValidateIf(o => !o.email || o.email === '')
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe: boolean = false;
}
