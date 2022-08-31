import { ITransportFabricChaincodeSettingsBatch, ITransportFabricSettingsBatch } from '@hlf-core/transport-chaincode';
import { ApplicationBaseSettings } from '@project/module/core/settings';
import { ChaincodeServerOpts } from 'fabric-shim';
import { DateUtil, Ed25519 } from '@ts-core/common';

export class AppSettings extends ApplicationBaseSettings implements ITransportFabricChaincodeSettingsBatch {
    // --------------------------------------------------------------------------
    //
    //  Chaincode Properties
    //
    // --------------------------------------------------------------------------

    public get chaincodeMode(): ChaincodeMode {
        return this.getValue('CHAINCODE_MODE', ChaincodeMode.INTERNAL);
    }

    public get chaincodeServerOptions(): ChaincodeServerOpts {
        return {
            ccid: this.getValue('CORE_CHAINCODE_ID'),
            address: this.getValue('CORE_CHAINCODE_ADDRESS'),
            tlsProps: null
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Batch Properties
    //
    // --------------------------------------------------------------------------

    public get batch(): ITransportFabricSettingsBatch {
        return {
            timeout: this.getValue('FABRIC_BATCH_TIMEOUT', DateUtil.MILLISECONDS_SECOND),
            algorithm: this.getValue('FABRIC_BATCH_ALGORITHM', Ed25519.ALGORITHM),
            publicKey: this.getValue('FABRIC_BATCH_PUBLIC_KEY', 'e365007e85508c6b44d5101a1d59d0061a48fd1bcd393186ccb5e7ae938a59a8'),
        };
    }
}
export enum ChaincodeMode {
    INTERNAL = 'INTERNAL',
    EXTERNAL = 'EXTERNAL',
}
