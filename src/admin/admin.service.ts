import {
  Injectable,
  Inject,
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
import { jwtSign } from '../utils/promisified';
import jwt from 'jsonwebtoken';

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

  prepareJWTCookie(token: string): string {
    return 'JWT ' + token;
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = this.configService.getDefaultConfig().passwordSalt;
      return await bcrypt.hash(password, salt).catch(err => {
        throw err;
      });
    } catch (err) {
      console.log('Error: ', err);
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

  async verifyPassword(
    password: string,
    adminPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, adminPassword);
  }

  private generateJWT(loginDTO: {
    username: string;
    email: string;
  }): Promise<string> {
    return new Promise(async (rs, rj) => {
      const payload = { email: loginDTO.email, username: loginDTO.username };
      const key = this.configService.getDefaultConfig().jwtKey;
      const signedToken = await jwtSign(payload, key).catch(err => rj(err));
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
      const signedToken = await this.generateJWT({
        username: admin.username,
        email: admin.email,
      }).catch(err => rj(new InternalServerErrorException()));

      if (!signedToken || isEmpty(signedToken))
        throw new InternalServerErrorException();

      return rs(signedToken as string);
    });
  }

  verifyToken(auth: string): Promise<boolean> {
    return new Promise<boolean>(async (rs, rj) => {
      if (auth && auth.toString().trim() !== '') {
        const token = auth.toLowerCase().includes('jwt ')
          ? auth.split(' ')[1]
          : auth;
        const jwtSecretKey = this.configService.getDefaultConfig().jwtKey;
        //Validate JWT Token
        jwt.verify(token, jwtSecretKey, (err, decoded) => {
          if (err) rj(new InternalServerErrorException());
          else if (decoded) {
            rs(true);
          } else rs(false);
        });
      } else {
        rs(false);
      }
    });
  }
}
