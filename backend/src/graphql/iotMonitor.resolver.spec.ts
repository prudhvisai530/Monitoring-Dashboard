import { Test, TestingModule } from '@nestjs/testing';
import { MonitorResolver } from './iotMonitor.resolver';
import { IotMonitorService } from '../iotMonitoring/iotMonitoring.service';
import { MonitorType } from './iotMonitor.type';

const mockSensorData: MonitorType[] = [
    {
        temperature: 25,
        humidity: 60,
        powerUsage: 200,
        createdAt: new Date().toISOString(),
    },
];

const mockIotMonitorService = {
    findAll: jest.fn().mockResolvedValue(mockSensorData),
};

describe('MonitorResolver', () => {
    let resolver: MonitorResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MonitorResolver,
                { provide: IotMonitorService, useValue: mockIotMonitorService },
            ],
        }).compile();

        resolver = module.get<MonitorResolver>(MonitorResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('getSensorData', () => {
        it('should return sensor data', async () => {
            const result = await resolver.getData();
            expect(result).toEqual(mockSensorData);
            expect(mockIotMonitorService.findAll).toHaveBeenCalled();
        });
    });
});
