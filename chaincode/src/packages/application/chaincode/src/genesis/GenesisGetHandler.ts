import { Injectable } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { IUserStubHolder } from '@project/module/core/guard';
import { IGenesis } from '@project/common/ledger';
import { GenesisGetCommand } from '@project/common/transport/command/GenesisGetCommand';
import { GenesisService } from './GenesisService';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class GenesisGetHandler extends TransportCommandFabricAsyncHandler<void, IGenesis, GenesisGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: GenesisService) {
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
