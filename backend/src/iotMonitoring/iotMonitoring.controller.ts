import {
  Controller,
  Post,
  Body,
  UseGuards,
  Logger,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { IotMonitorService } from './iotMonitoring.service';
import { CreateIotMonitoringDto } from './dto/iotMonitoring.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';

@Controller('iotMonitor')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class IotMonitorController {
  private readonly logger = new Logger(IotMonitorController.name);

  constructor(private readonly iotMonitorService: IotMonitorService) {}

  @Post('data')
  @Roles(Role.Admin)
  async create(@Body() dto: CreateIotMonitoringDto) {
    this.logger.log(`Request to generate IoT monitoring data`);
    try {
      const result = await this.iotMonitorService.create(dto);
      return result;
    } catch (error) {
      this.logger.error(
        `Error while creating IoT monitoring data`,
        error.stack,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create IoT monitoring data',
      );
    }
  }
}
