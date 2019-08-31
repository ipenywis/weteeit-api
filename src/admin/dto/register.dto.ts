import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAdminDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
