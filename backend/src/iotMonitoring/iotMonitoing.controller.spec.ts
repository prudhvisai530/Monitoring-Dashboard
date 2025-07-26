import { Test, TestingModule } from '@nestjs/testing';
import { IotMonitorController } from './iotMonitoring.controller';
import { IotMonitorService } from './iotMonitoring.service';
import { CreateIotMonitoringDto } from './dto/iotMonitoring.dto';
import { InternalServerErrorException, HttpException } from '@nestjs/common';

describe('IotMonitorController', () => {
  let controller: IotMonitorController;
  let service: IotMonitorService;

  const mockService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IotMonitorController],
      providers: [
        {
          provide: IotMonitorService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<IotMonitorController>(IotMonitorController);
    service = module.get<IotMonitorService>(IotMonitorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call service.create and return result', async () => {
    const dto: CreateIotMonitoringDto = {
      temperature: 45,
      humidity: 20,
      powerUsage: 50,
    };
    const mockResponse = { success: true };

    mockService.create.mockResolvedValue(mockResponse);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResponse);
  });

  it('should throw HttpException if service throws HttpException', async () => {
    const dto: CreateIotMonitoringDto = {
      temperature: 45,
      humidity: 20,
      powerUsage: 50,
    };
    const error = new HttpException('Bad Request', 400);
    mockService.create.mockRejectedValue(error);

    await expect(controller.create(dto)).rejects.toThrow(HttpException);
  });

  it('should throw InternalServerErrorException if service throws other errors', async () => {
    const dto: CreateIotMonitoringDto = {
      temperature: 45,
      humidity: 20,
      powerUsage: 50,
    };

    const error = new Error('Some DB error');
    mockService.create.mockRejectedValue(error);

    await expect(controller.create(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
