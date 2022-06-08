import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import { ChaincodeResponse, ChaincodeStub } from 'fabric-shim';
import * as _ from 'lodash';
import { GenesisService } from './genesis/GenesisService';
import { TransportFabricChaincode, TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';

@Injectable()
export class Chaincode extends TransportFabricChaincode<void> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, private genesis: GenesisService) {
        super(logger, transport);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public async Init(stub: ChaincodeStub): Promise<ChaincodeResponse> {
        let item = await this.genesis.get(stub);
        if (!_.isNil(item)) {
            this.log(`Genesis data already exists`);
            return super.Init(stub);
        }

        await this.genesis.add(stub);
        this.log(`Genesis data successfully added`);
        return super.Init(stub);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get name(): string {
        return `Karma chaincode`;
    }
}
