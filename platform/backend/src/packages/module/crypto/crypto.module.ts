import { DatabaseModule } from '@project/module/database';
import { Logger, ILogger } from '@ts-core/common/logger';
import { LoggerModule } from '@ts-core/backend-nestjs/logger';
import { TransportModule } from '@ts-core/backend-nestjs/transport';
import { CryptoDecryptHandler } from './transport/handler/CryptoDecryptHandler';
import { CryptoEncryptHandler } from './transport/handler/CryptoEncryptHandler';
import { CryptoLedgerSignHandler } from './transport/handler/CryptoLedgerSignHandler';
import { DynamicModule } from '@nestjs/common';
import { CryptoService, ICryptoSettings } from './service';

export class CryptoModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: ICryptoSettings): DynamicModule {
        return {
            module: CryptoModule,
            imports: [
                LoggerModule,
                TransportModule,
                DatabaseModule,
            ],
            providers: [
                {
                    provide: CryptoService,
                    inject: [Logger],
                    useFactory: async (logger: ILogger) => {
                        let item = new CryptoService(logger, settings);
                        return item;
                    },
                },
                CryptoDecryptHandler,
                CryptoEncryptHandler,
                CryptoLedgerSignHandler
            ],
            exports: [CryptoService]
        };
    }
}
