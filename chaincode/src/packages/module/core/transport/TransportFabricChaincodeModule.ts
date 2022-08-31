import { DynamicModule, Provider } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { GenesisGetCommand } from '@project/common/transport/command';
import { TransportCryptoManagerEd25519 } from '@ts-core/common';
import { TransportCryptoManagerGostR3410 } from '@ts-core/crypto-gost';
import { UserGetCommand } from '@project/common/transport/command/user';
import { CompanyGetCommand } from '@project/common/transport/command/company';
import { ProjectGetCommand } from '@project/common/transport/command/project';
import { TransportFabricChaincodeReceiver, TransportFabricChaincodeReceiverBatch, ITransportFabricChaincodeSettingsBatch } from '@hlf-core/transport-chaincode';
// import { TransportCryptoManagerRSA } from '@ts-core/crypto-rsa/transport';  new TransportCryptoManagerRSA()

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
                    ],
                    nonSignedCommands: [UserGetCommand.NAME, CompanyGetCommand.NAME, ProjectGetCommand.NAME, GenesisGetCommand.NAME],
                    batch: settings.batch
                });
                return item;
            }
        });
        providers.push({ provide: Transport, useExisting: TransportFabricChaincodeReceiver })

        return {
            module: TransportFabricChaincodeModule,
            exports: providers,
            global: true,
            providers,
        };
    }
}
