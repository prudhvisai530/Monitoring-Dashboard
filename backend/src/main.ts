import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalGuards();

  await app.listen(process.env.PORT ?? 3000);
}
function getRandomSensorData() {
  return {
    temperature: Number((Math.random() * 30 + 10).toFixed(2)), // 10°C to 40°C
    humidity: Number((Math.random() * 50 + 30).toFixed(2)), // 30% to 80%
    powerUsage: Number((Math.random() * 500 + 100).toFixed(2)), // 100W to 600W
  };
}

async function sendSensorData() {
  const data = getRandomSensorData();
  try {
    console.log(data);
    const response = await axios.post(
      'http://localhost:3000/iotMonitor/data',
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Sent: Response', response.status);
  } catch (error) {
    console.error('Error sending sensor data:', error.message);
  }
}

setInterval(sendSensorData, 300000);
bootstrap();
