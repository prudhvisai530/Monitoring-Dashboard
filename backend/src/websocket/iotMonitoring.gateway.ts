// sensor.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class MonitorGateway implements OnGatewayConnection {
  private readonly logger = new Logger(MonitorGateway.name);
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  sendSensorUpdate(data: any) {
    this.logger.log(`Broadcasting sensor data: ${JSON.stringify(data)}`);
    this.server.emit('iotData', data);
  }
}
