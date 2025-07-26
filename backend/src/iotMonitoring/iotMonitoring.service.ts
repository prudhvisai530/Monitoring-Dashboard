import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Monitor } from './schemas/iotMonitoring.schema';
import { CreateIotMonitoringDto } from './dto/iotMonitoring.dto';
import { MonitorGateway } from '../websocket/iotMonitoring.gateway';

@Injectable()
export class IotMonitorService {
  private readonly logger = new Logger(IotMonitorService.name);

  constructor(
    @InjectModel(Monitor.name) private monitorModel: Model<Monitor>,
    private readonly sensorGateway: MonitorGateway,
  ) { }

  async create(data: CreateIotMonitoringDto): Promise<Monitor> {
    this.logger.log(`Creating new data: ${JSON.stringify(data)}`);
    try {
      const savedData = await this.monitorModel.create(data);
      this.sensorGateway.sendSensorUpdate(savedData);
      this.logger.log('Data broadcasted to clients.');
      return savedData;
    } catch (error) {
      this.logger.error('Error creating data', error.stack);
      throw new InternalServerErrorException('Failed to create data');
    }
  }

  async findAll(): Promise<Monitor[]> {
    try {
      this.logger.log('Fetching data...');
      const response = await this.monitorModel.find().sort({ createdAt: -1 });
      this.logger.log('Data fetched successfully');
      return response;
    } catch (error) {
      this.logger.error('Error fetching data', error.stack);
      throw new InternalServerErrorException('Failed to fetch data');
    }
  }

  async findByDate(dateString: string): Promise<any[]> {
    const date = new Date(dateString);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    return this.monitorModel.find({
      createdAt: {
        $gte: date,
        $lt: nextDay,
      },
    }).exec();
  }
}
