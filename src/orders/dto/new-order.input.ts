import { InputType, Field, Int, ObjectType } from 'type-graphql';
import {
  IsEmail,
  IsPhoneNumber,
  Matches,
  IsUrl,
  IsArray,
  IsString,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ALGERIA_PHONE_REGEX } from '../../common/regex';
import { Default } from 'sequelize-typescript';

@InputType()
export class OrderProductInput {
  @Field()
  @IsString()
  name: string;

  @Field(type => Int)
  @IsInt()
  quantity: number;
}

@InputType()
export class NewOrderInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  address: string;

  @Field()
  @Matches(ALGERIA_PHONE_REGEX)
  phone: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  facebook_profile?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  wilaya: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  instructions: string;

  @Field({ nullable: true })
  shipped: boolean = false;

  @Field(type => [OrderProductInput])
  @IsArray()
  products: OrderProductInput[];
}
