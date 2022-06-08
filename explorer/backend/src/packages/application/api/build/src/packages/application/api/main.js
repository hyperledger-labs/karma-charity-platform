"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const logger_1 = require("@ts-core/backend-nestjs/logger");
const middleware_1 = require("@ts-core/backend-nestjs/middleware");
const file_1 = require("@ts-core/backend/file");
const util_1 = require("@ts-core/common/util");
const compression = require("compression");
const path = require("path");
const AppModule_1 = require("./src/AppModule");
const AppSettings_1 = require("./src/AppSettings");
async function generateDocs(application) {
    let options = new swagger_1.DocumentBuilder()
        .setTitle('HLF Explorer API')
        .setDescription('The HLF explorer API description')
        .setVersion('1.0')
        .addTag('hlf-explorer')
        .build();
    let document = swagger_1.SwaggerModule.createDocument(application, options);
    swagger_1.SwaggerModule.setup('api', application, document);
    await file_1.FileUtil.jsonSave(path.resolve(process.cwd(), 'swagger.json'), document);
}
async function bootstrap() {
    let settings = new AppSettings_1.AppSettings();
    let logger = (settings.logger = new logger_1.DefaultLogger(settings.loggerLevel));
    let application = await core_1.NestFactory.create(AppModule_1.AppModule.forRoot(settings), { logger });
    application.useLogger(logger);
    application.use(compression());
    application.enableCors({ origin: true });
    application.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    application.useGlobalFilters(new middleware_1.AllErrorFilter(new middleware_1.ValidationExceptionFilter(), new middleware_1.ExtendedErrorFilter(), new middleware_1.HttpExceptionFilter()));
    const server = application.getHttpServer();
    server.setTimeout(10 * util_1.DateUtil.MILISECONDS_MINUTE);
    await application.listen(settings.webPort);
    logger.log(`Listening "${settings.webPort}" port`);
}
bootstrap();
