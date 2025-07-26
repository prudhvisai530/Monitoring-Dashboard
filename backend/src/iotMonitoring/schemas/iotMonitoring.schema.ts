import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Monitor extends Document {
  @Prop()
  temperature: number;

  @Prop()
  humidity: number;

  @Prop()
  powerUsage: number;
}

export const IotMonitoringSchema = SchemaFactory.createForClass(Monitor);
