import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IotMonitorService } from './iotMonitoring.service';
import { IotMonitorController } from './iotMonitoring.controller';
import { Monitor, IotMonitoringSchema } from './schemas/iotMonitoring.schema';
import { MonitorResolver } from '../graphql/iotMonitor.resolver';
import { MonitorGateway } from '../websocket/iotMonitoring.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Monitor.name, schema: IotMonitoringSchema },
    ]),
  ],
  controllers: [IotMonitorController],
  providers: [IotMonitorService, MonitorResolver, MonitorGateway],
  exports: [IotMonitorService],
})
export class IotMonitorModule {}
