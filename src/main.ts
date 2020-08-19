import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import swaggerOptions from './config/swagger';
import 'source-map-support/register';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  process.env.NODE_ENV = !process.env.NODE_ENV ? 'local' : process.env.NODE_ENV;

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
  app.use(compression());
  app.use(helmet());
  app.use(morgan('dev'));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpErrorFilter());

  await app.listen(port, () => console.log(`Server listening on port ${port} => env: ${process.env.ENVIRONMENT}`));
}
bootstrap();
