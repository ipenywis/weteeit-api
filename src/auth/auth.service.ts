import { Injectable } from '@nestjs/common';
import { Admin } from '../admin/models/admin';

export interface AuthAdmin {
  email: Admin['email'];
  username: Admin['username'];
}

@Injectable()
export class AuthService {
  private authAdmin: AuthAdmin;

  setAuthenticatedAdmin(admin: AuthAdmin) {
    this.authAdmin = admin;
  }

  getAuthenticatedAdmin(): AuthAdmin {
    return this.authAdmin;
  }
}
