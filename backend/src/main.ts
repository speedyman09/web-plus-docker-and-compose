import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO: ENABLE CORS
  // app.use(
  //   cors({
  //     origin: [
  //       'https://stepanseliuk.nomoredomainsmonster.ru'
  //     ],
  //   }),
  // );
  await app.listen(4000);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
}
bootstrap();
