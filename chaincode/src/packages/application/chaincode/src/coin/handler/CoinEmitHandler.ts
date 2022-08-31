import { Injectable } from '@nestjs/common';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { CoinEmitCommand, ICoinEmitDto } from '@project/common/transport/command/coin';
import { CoinEmittedEvent } from '@project/common/transport/event/coin';
import { LedgerRole } from '@project/common/ledger/role';
import { CoinService } from '../service/CoinService';

@Injectable()
export class CoinEmitHandler extends TransportCommandFabricAsyncHandler<ICoinEmitDto, void, CoinEmitCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: CoinService) {
        super(logger, transport, CoinEmitCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICoinEmitDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesCheck(holder, LedgerRole.COIN_MANAGER);

        await this.service.walletAmountEmit(holder, await this.service.getWallet(params.to, holder), params.amount);
        await holder.stub.dispatch(new CoinEmittedEvent(holder.eventData));
    }
}
