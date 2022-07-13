import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DefaultLogger } from '@ts-core/backend-nestjs/logger';
import { AllErrorFilter, ExtendedErrorFilter, HttpExceptionFilter, ValidationExceptionFilter } from '@ts-core/backend-nestjs/middleware';
import { FileUtil } from '@ts-core/backend/file';
import { DateUtil } from '@ts-core/common/util';
import { TransportHttp } from '@ts-core/common/transport/http';
import { rawBodyParser } from '@project/module/shared/parser/RawBodyParser';
import { AppModule } from './src/AppModule';
import { AppSettings } from './src/AppSettings';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as path from 'path';
import * as _ from 'lodash';
import helmet from "helmet";
import { CoreExtendedErrorFilter } from '@project/module/core/middleware';

async function generateDocs(application: INestApplication): Promise<void> {
    let options = new DocumentBuilder()
        .setTitle('HLF Explorer API')
        .setDescription('The HLF explorer API description')
        .setVersion('1.0')
        .addTag('hlf-explorer')
        .build();
    let document = SwaggerModule.createDocument(application, options);
    SwaggerModule.setup('api', application, document);

    await FileUtil.jsonSave(path.resolve(process.cwd(), 'swagger.json'), document);
}

async function bootstrap(): Promise<void> {
    let settings = new AppSettings();
    let logger = (settings.logger = new DefaultLogger(settings.loggerLevel));

    let application = await NestFactory.create(AppModule.forRoot(settings), { logger, bodyParser: true, });
    application.useLogger(logger);

    application.use(bodyParser.json({ limit: '5mb' }));
    // application.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

    application.use(helmet());
    application.use(compression());
    application.use(rawBodyParser());

    // application.enableCors({ origin: true });
    application.enableCors();
    application.useGlobalPipes(new ValidationPipe({ transform: true }));
    application.useGlobalFilters(new AllErrorFilter(new ValidationExceptionFilter(), new CoreExtendedErrorFilter(), new ExtendedErrorFilter(), new HttpExceptionFilter()));

    const server = application.getHttpServer();
    server.setTimeout(10 * DateUtil.MILISECONDS_MINUTE);

    // application.use(bodyParser.json({ verify: rawBodyBuffer }));
    // await generateDocs(application);

    await application.listen(settings.webPort);
    logger.log(`Listening "${settings.webPort}" port`);
}

bootstrap();
