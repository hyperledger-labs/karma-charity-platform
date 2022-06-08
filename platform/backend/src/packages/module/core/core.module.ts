import { ILogger, Logger } from '@ts-core/common/logger';
import { Transport } from '@ts-core/common/transport';
import { DynamicModule } from '@nestjs/common';
import { LedgerApiClient } from '@hlf-explorer/common/api';
import { LoggerModule } from '@ts-core/backend-nestjs/logger';
import { LedgerApiClient as CommonLedgerApiClient } from './service';
import { TransportModule } from '@ts-core/backend-nestjs/transport';

export class CoreModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: ICoreSettings): DynamicModule {
        return {
            module: CoreModule,
            imports: [
                LoggerModule,
                TransportModule
            ],
            providers: [
                {
                    provide: CommonLedgerApiClient,
                    inject: [Logger, Transport],
                    useFactory: async (logger: ILogger, transport: Transport) => {
                        let item = new CommonLedgerApiClient(logger, transport, settings.hlfExplorerEndpoint, settings.ledgerName);
                        return item;
                    },
                },
                {
                    provide: LedgerApiClient,
                    useExisting: CommonLedgerApiClient
                }
            ],
            controllers: [],
            exports: [LedgerApiClient, CommonLedgerApiClient]
        };
    }
}

export interface ICoreSettings {
    ledgerName: string;
    hlfExplorerEndpoint: string;
}
