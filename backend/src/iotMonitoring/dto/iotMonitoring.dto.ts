import { IsNumber } from 'class-validator';

export class CreateIotMonitoringDto {
  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;

  @IsNumber()
  powerUsage: number;
}
