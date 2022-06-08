import { NestFactory, ModuleRef } from '@nestjs/core';
import { DefaultLogger } from '@ts-core/backend-nestjs/logger';
import { AppModule } from './src/AppModule';
import { AppSettings, ChaincodeMode } from './src/AppSettings';
import { Chaincode } from './src/Chaincode';
import { Shim } from 'fabric-shim';
import { APPLICATION_INJECTOR } from '@ts-core/backend-nestjs';

async function bootstrap() {
    let settings = new AppSettings();
    let logger = (settings.logger = new DefaultLogger(settings.loggerLevel));

    let application = await NestFactory.createApplicationContext(AppModule.forRoot(settings), { logger });
    APPLICATION_INJECTOR(application.get(ModuleRef));

    let chaincode = application.get(Chaincode);
    logger.log(`Chaincode "${chaincode.name}" ran on "${settings.chaincodeMode}" mode`);
    if (settings.chaincodeMode === ChaincodeMode.INTERNAL) {
        let client = Shim.start(chaincode);
        return;

    }

    logger.log(`Chaincode server options:\n"${JSON.stringify(settings.chaincodeServerOptions, null, 4)}"`);
    let server = Shim.server(chaincode, settings.chaincodeServerOptions);
    server.start();
}

bootstrap();