import { Injectable } from '@nestjs/common';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class AuthAdmin {
  @Field()
  username: string;

  @Field()
  email: string;
}

@Injectable()
export class AuthService {
  private authAdmin: AuthAdmin | null;

  setAuthenticatedAdmin(admin: AuthAdmin | null) {
    this.authAdmin = admin && { username: admin.username, email: admin.email };
  }

  getAuthenticatedAdmin(): AuthAdmin {
    return this.authAdmin;
  }

  isAuthenticated(): boolean {
    return this.authAdmin ? true : false;
  }
}
