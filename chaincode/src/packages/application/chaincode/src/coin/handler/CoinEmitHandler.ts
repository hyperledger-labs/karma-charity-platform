import { Injectable } from '@nestjs/common';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { CoinEmitCommand, ICoinEmitDto } from '@project/common/transport/command/coin';
import { CoinEmittedEvent } from '@project/common/transport/event/coin';
import { LedgerRole } from '@project/common/ledger/role';
import { CoinService } from '../service/CoinService';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class CoinEmitHandler extends TransportCommandFabricAsyncHandler<ICoinEmitDto, void, CoinEmitCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, private service: CoinService) {
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
