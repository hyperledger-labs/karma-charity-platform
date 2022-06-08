import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { CoinBurnCommand, ICoinBurnDto } from '@project/common/transport/command/coin';
import { CoinBurnedEvent } from '@project/common/transport/event/coin';
import { LedgerRole } from '@project/common/ledger/role';
import { CoinService } from '../service/CoinService';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';

@Injectable()
export class CoinBurnHandler extends TransportCommandFabricAsyncHandler<ICoinBurnDto, void, CoinBurnCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, private service: CoinService) {
        super(logger, transport, CoinBurnCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICoinBurnDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesCheck(holder, LedgerRole.COIN_MANAGER);

        await this.service.walletAmountBurn(holder, await this.service.getWallet(params.from, holder), params.amount);
        await holder.stub.dispatch(new CoinBurnedEvent(holder.eventData));
    }
}
