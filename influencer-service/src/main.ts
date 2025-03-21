import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use('/health', (req, res) => {
    res.status(200).send('OK');
  });

  await app.listen(3000);
}
bootstrap();
