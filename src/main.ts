import {HttpStatus, Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {SwaggerTheme, SwaggerThemeNameEnum} from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Zeine Challenge API')
    .setDescription('Documentation for Zeine Challenge API')
    .setVersion('1.0')
    // .addTag('user')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
  };
  SwaggerModule.setup('docs', app, document, options);

  app.useGlobalPipes(new ValidationPipe());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization',
    );

    if (req.method === 'OPTIONS') {
      return res.sendStatus(HttpStatus.OK);
    }

    next();
  });

  app.enableCors({
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    optionsSuccessStatus: 204,
    preflightContinue: false,
    allowedHeaders: '*',
    origin: '*',
  });
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
  const logger = new Logger('bootstrap');
  logger.log(`Listening on ${await app.getUrl()}`);
}
bootstrap();
