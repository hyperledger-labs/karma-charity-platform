import { DynamicModule, Provider } from '@nestjs/common';
import { LedgerBlockGetController, LedgerBlockListController } from './controller/block';
import { LedgerService, LedgerApiMonitor } from './service';
import { LedgerBlockParseHandler, LedgerBatchHandler, LedgerStateCheckHandler } from './handler';
import { LEDGER_SOCKET_NAMESPACE } from '@hlf-explorer/common/api';
import { Logger, ILogger } from '@ts-core/common/logger';
import { LedgerBlockTransactionGetController, LedgerBlockTransactionListController } from './controller/transaction';
import { LedgerSearchController, LedgerResetController, LedgerRequestController } from './controller';
import { LedgerBlockEventGetController, LedgerBlockEventListController } from './controller/event';
import { LedgerInfoGetController, LedgerInfoListController } from './controller/info';
import { LedgerGuard, LedgerGuardPaginable } from './service/guard';
import { LedgerSettingsFactory, LedgerTransportFactory } from './service';
import { DatabaseModule } from '@project/module/database';

export class LedgerModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(ledgersSettingsPath: string): DynamicModule {
        const providers: Array<Provider> = [
            {
                provide: LEDGER_SOCKET_NAMESPACE,
                inject: [LedgerService],
                useFactory: async (ledger: LedgerService) => {
                    await ledger.initialize();
                    return LEDGER_SOCKET_NAMESPACE;
                },
            },
            {
                provide: LedgerSettingsFactory,
                inject: [Logger],
                useFactory: async (logger: ILogger) => {
                    let item = new LedgerSettingsFactory(logger);
                    await item.load(ledgersSettingsPath);
                    return item;
                },
            },

            LedgerTransportFactory,

            LedgerGuard,
            LedgerGuardPaginable,

            LedgerService,
            LedgerApiMonitor,
            LedgerBatchHandler,
            LedgerBlockParseHandler,
            LedgerStateCheckHandler,
        ];
        return {
            imports: [DatabaseModule],
            module: LedgerModule,
            controllers: [
                LedgerResetController,
                LedgerSearchController,
                LedgerRequestController,

                LedgerInfoGetController,
                LedgerInfoListController,
                LedgerBlockGetController,
                LedgerBlockListController,
                LedgerBlockEventGetController,
                LedgerBlockEventListController,
                LedgerBlockTransactionGetController,
                LedgerBlockTransactionListController,
            ],
            providers,
            exports: providers,
        };
    }
}
