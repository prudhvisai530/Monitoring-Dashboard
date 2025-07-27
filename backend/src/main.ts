import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
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
    temperature: Number((Math.random() * 30 + 10).toFixed(2)),
    humidity: Number((Math.random() * 50 + 30).toFixed(2)),
    powerUsage: Number((Math.random() * 500 + 100).toFixed(2)),
  };
}

function readAccessToken(): string | null {
  try {
    const tokenPath = path.resolve(__dirname, '../access_token.txt');
    return fs.readFileSync(tokenPath, 'utf-8').trim();
  } catch (err) {
    console.error('Error reading access_token:', err.message);
    return null;
  }
}


async function sendSensorData() {
  const data = getRandomSensorData();
  try {
    const response = await axios.post(
      'http://localhost:3000/iotMonitor/data',
      data,
      {
        headers: {
          Authorization: `Bearer ${readAccessToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Sent: Response', response.status);
  } catch (error) {
    console.error('Error sending sensor data:', error.message);
  }
}

setInterval(sendSensorData, 60 * 60 * 1000);
bootstrap();
