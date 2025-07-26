import { Resolver, Query, Args } from '@nestjs/graphql';
import { IotMonitorService } from '../iotMonitoring/iotMonitoring.service';
import { MonitorType } from './iotMonitor.type';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { GqlAuthGuard } from '../auth/guards/graphql.guard';
import { Logger } from '@nestjs/common';

@Resolver(() => MonitorType)
export class MonitorResolver {
  private readonly logger = new Logger(MonitorResolver.name);
  constructor(private monitorService: IotMonitorService) { }

  @Query(() => [MonitorType])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async getData() {
    this.logger.log('Request to fetch data');
    return this.monitorService.findAll();
  }

  @Query(() => [MonitorType])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async getDataByDate(
    @Args('date', { type: () => String }) date: string,
  ): Promise<MonitorType[]> {
    this.logger.log(`Fetching sensor data for date: ${date}`);
    return this.monitorService.findByDate(date);
  }
}
