import { Test, TestingModule } from '@nestjs/testing';
import { IotMonitorService } from './iotMonitoring.service';
import { getModelToken } from '@nestjs/mongoose';
import { Monitor } from './schemas/iotMonitoring.schema';
import { MonitorGateway } from '../websocket/iotMonitoring.gateway';
import { InternalServerErrorException } from '@nestjs/common';

// Sample DTO
const mockDto = {
  temperature: 45,
  humidity: 20,
  powerUsage: 50,
};

describe('IotMonitorService', () => {
  let service: IotMonitorService;
  let monitorModel: any;
  let sensorGateway: MonitorGateway;

  beforeEach(async () => {
    const monitorModelMock = {
      create: jest.fn(),
      find: jest.fn(),
    };

    const sensorGatewayMock = {
      sendSensorUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IotMonitorService,
        {
          provide: getModelToken(Monitor.name),
          useValue: monitorModelMock,
        },
        {
          provide: MonitorGateway,
          useValue: sensorGatewayMock,
        },
      ],
    }).compile();

    service = module.get<IotMonitorService>(IotMonitorService);
    monitorModel = module.get(getModelToken(Monitor.name));
    sensorGateway = module.get<MonitorGateway>(MonitorGateway);
  });

  describe('create', () => {
    it('should save data and call gateway', async () => {
      const savedData = { ...mockDto, _id: 'abc123' };
      monitorModel.create.mockResolvedValue(savedData);

      const result = await service.create(mockDto);

      expect(monitorModel.create).toHaveBeenCalledWith(mockDto);
      expect(sensorGateway.sendSensorUpdate).toHaveBeenCalledWith(savedData);
      expect(result).toEqual(savedData);
    });

    it('should throw InternalServerErrorException on failure', async () => {
      monitorModel.create.mockRejectedValue(new Error('DB Error'));

      await expect(service.create(mockDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return sorted data', async () => {
      const data = [{ deviceId: '123' }, { deviceId: '456' }];
      const sortMock = jest.fn().mockResolvedValue(data);
      monitorModel.find.mockReturnValue({ sort: sortMock });

      const result = await service.findAll();

      expect(monitorModel.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(data);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const sortMock = jest.fn().mockRejectedValue(new Error('Sort error'));
      monitorModel.find.mockReturnValue({ sort: sortMock });

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
