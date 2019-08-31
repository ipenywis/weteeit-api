import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Admin } from './models/admin';
import { CreateAdminDTO } from './dto/register.dto';
import { isEmpty } from 'lodash';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '../config/config.service';
import { LoginDTO } from './dto/login.dto';
import jwt, { sign } from 'jsonwebtoken';
import { promisify } from 'bluebird';

@Injectable()
export class AdminService {
  constructor(
    @Inject('ADMINS_REPOSITORY') private ADMINS_REPOSITORY: typeof Admin,
    private configService: ConfigService,
  ) {}

  adminExists(username?: string, email?: string): Promise<boolean> {
    return new Promise(async (rs, rj) => {
      const admin = await this.ADMINS_REPOSITORY.findOne({
        where: { [Op.or as any]: [{ username }, { email }] },
      }).catch(err => rj(err));
      if (admin && !isEmpty(admin)) return rs(true);
      return rs(false);
    });
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = this.configService.getDefaultConfig().passwordSalt;
      return await bcrypt.hash(password, salt).catch(err => {
        throw err;
      });
    } catch (err) {
      return password;
    }
  }

  storeAdmin(createAdminDTO: CreateAdminDTO): Promise<Admin> {
    return new Promise(async (rs, rj) => {
      //Hash Password
      const hashedPassword = await this.hashPassword(createAdminDTO.password);
      const admin = await this.ADMINS_REPOSITORY.create({
        ...createAdminDTO,
        password: hashedPassword,
      }).catch(err => rj(err));
      if (!admin || isEmpty(admin))
        return rj(new InternalServerErrorException('Cannot Register Admin'));
      return rs(admin);
    });
  }

  verifyPassword(password: string, adminPassword: string): Promise<boolean> {
    return new Promise(async (rs, rj) => {
      const hashedPassword = await this.hashPassword(password).catch(err =>
        rj(err),
      );
      return rs(adminPassword === hashedPassword);
    });
  }

  generateJWT(loginDTO: LoginDTO): Promise<string> {
    return new Promise(async (rs, rj) => {
      const payload = { email: loginDTO.email, username: loginDTO.username };
      const key = this.configService.getDefaultConfig().jwtKey;
      const signedToken = await promisify(jwt.sign)(payload, key).catch(err =>
        rj(err),
      );
      if (!signedToken || isEmpty(signedToken))
        return rj(new InternalServerErrorException());
      return rs(signedToken as string);
    });
  }

  /**
   * Login compares password and authenticates the admin returning `JWT` `Auth-Token`
   * @param loginDTO
   */
  login(loginDTO: LoginDTO): Promise<string> {
    return new Promise(async (rs, rj) => {
      let query = {};
      if (loginDTO.email) query = { email: loginDTO.email };
      else if (loginDTO.username) query = { username: loginDTO.username };

      const admin = await this.ADMINS_REPOSITORY.findOne({
        where: query,
      });

      if (!admin || isEmpty(admin))
        return rj(
          new UnauthorizedException('Email, username or password is wrong'),
        );

      //Check password
      const isValidPassword = await this.verifyPassword(
        loginDTO.password,
        admin.password,
      ).catch(err => rj(err));
      if (!isValidPassword)
        return rj(
          new UnauthorizedException('Email, username or password is wrong'),
        );

      //Sign Admin Token
      const signedToken = await this.generateJWT(loginDTO).catch(
        err => new InternalServerErrorException(),
      );
      return rs(signedToken as string);
    });
  }
}
