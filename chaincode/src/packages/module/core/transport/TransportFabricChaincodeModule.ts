import { Global, DynamicModule, Provider } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { GenesisGetCommand } from '@project/common/transport/command';
import { TransportCryptoManagerEd25519 } from '@ts-core/common/transport/crypto';
import { TransportCryptoManagerGostR3410 } from '@ts-core/crypto-gost/transport';
// import { TransportCryptoManagerRSA } from '@ts-core/crypto-rsa/transport';
import { UserGetCommand } from '@project/common/transport/command/user';
import { CompanyGetCommand } from '@project/common/transport/command/company';
import { ProjectGetCommand } from '@project/common/transport/command/project';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { ITransportFabricChaincodeSettingsBatch, TransportFabricChaincodeReceiverBatch } from '@hlf-core/transport/chaincode/batch';

@Global()
export class TransportFabricChaincodeModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: ITransportFabricChaincodeSettingsBatch): DynamicModule {
        let providers: Array<Provider> = [];
        providers.push({
            provide: TransportFabricChaincodeReceiver,
            inject: [Logger],
            useFactory: async (logger: Logger) => {
                let item = new TransportFabricChaincodeReceiverBatch(logger, {
                    cryptoManagers: [
                        new TransportCryptoManagerGostR3410(),
                        new TransportCryptoManagerEd25519(),
                        // new TransportCryptoManagerRSA()
                    ],
                    nonSignedCommands: [UserGetCommand.NAME, CompanyGetCommand.NAME, ProjectGetCommand.NAME, GenesisGetCommand.NAME],
                    batch: settings.batch
                });
                return item;
            }
        });
        return {
            module: TransportFabricChaincodeModule,
            imports: [],
            providers,
            exports: providers
        };
    }
}
