import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { IUserStubHolder } from '@project/module/core/guard';
import { IGenesis } from '@project/common/ledger';
import { GenesisGetCommand } from '@project/common/transport/command/GenesisGetCommand';
import { GenesisService } from './GenesisService';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class GenesisGetHandler extends TransportCommandFabricAsyncHandler<void, IGenesis, GenesisGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, private service: GenesisService) {
        super(logger, transport, GenesisGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: void, @StubHolder() holder: IUserStubHolder): Promise<IGenesis> {
        return this.service.get(holder.stub);
    }
}
