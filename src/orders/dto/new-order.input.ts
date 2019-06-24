import { InputType, Field, Int } from 'type-graphql';
import { IsEmail, IsPhoneNumber, Matches, IsUrl } from 'class-validator';
import { isRegExp } from 'util';
import { ALGERIA_PHONE_REGEX } from '../../common/regex';

@InputType()
export class NewOrderInput {
  @Field()
  productId: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  address: string;

  @Field()
  @Matches(ALGERIA_PHONE_REGEX)
  phone: string;

  @Field()
  @IsUrl()
  facebook_profile: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  wilaya: string;

  @Field()
  city: string;

  @Field(type => Int)
  quantity: number;
}
