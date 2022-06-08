import { DynamicModule, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { LoggerModule } from '@ts-core/backend-nestjs/logger';
import { AppSettings } from './AppSettings';
import { Chaincode } from './Chaincode';
import { UserModule } from './user/UserModule';
import { TransportFabricChaincodeModule } from '@project/module/core/transport';
import { CoinModule } from './coin/CoinModule';
import { CompanyModule } from './company/CompanyModule';
import { ProjectModule } from './project/ProjectModule';
import { GenesisModule } from './genesis/GenesisModule';
import { Logger } from '@ts-core/common/logger';
import { PromiseHandler } from '@ts-core/common/promise';
import { DateUtil } from '@ts-core/common/util';
import { AbstractService } from '@project/module/core';
import * as fabricUtils from 'fabric-shim/lib/logger';

export class AppModule extends AbstractService implements OnApplicationBootstrap {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: AppSettings): DynamicModule {
        return {
            module: AppModule,
            imports: [
                LoggerModule.forRoot(settings),
                TransportFabricChaincodeModule.forRoot(settings),
                GenesisModule,
                CoinModule,
                UserModule,
                CompanyModule,
                ProjectModule
            ],
            providers: [
                {
                    provide: AppSettings,
                    useValue: settings
                },
                Chaincode
            ],
            controllers: []
        };
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    public constructor(@Inject(Logger) logger: Logger, settings: AppSettings, chaincode: Chaincode) {
        super(chaincode.name, settings, logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async onApplicationBootstrap(): Promise<void> {
        await super.onApplicationBootstrap();
        if (this.settings.isTesting) {
            this.warn(`Service works in ${this.settings.mode}: some functions could work different way`);
        }
        this.initialize();
    }

    private async initialize(): Promise<void> {
        await PromiseHandler.delay(DateUtil.MILISECONDS_SECOND);
        // Disable logger
        /*
        fabricUtils.getLogger('Peer.js').transports.console.silent = true;
        fabricUtils.getLogger('lib/handler.js').silent = true;
        fabricUtils.getLogger('c-api:lib/handler.js').silent = true;
        */
    }
}
