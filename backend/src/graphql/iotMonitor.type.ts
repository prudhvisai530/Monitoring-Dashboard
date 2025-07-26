import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class MonitorType {
  @Field(() => Float)
  temperature: number;

  @Field(() => Float)
  humidity: number;

  @Field(() => Float)
  powerUsage: number;

  @Field()
  createdAt: string;
}
