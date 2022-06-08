import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { UserGuard, IUserStubHolder, rolesCompanyCheck, rolesProjectCheck, rolesSomeOf } from '@project/module/core/guard';
import { CoinTransferCommand, ICoinTransferDto, CoinObjectType } from '@project/common/transport/command/coin';
import { CoinTransferedEvent } from '@project/common/transport/event/coin';
import { LedgerCompanyRole, LedgerProjectRole } from '@project/common/ledger/role';
import { CoinService } from '../service/CoinService';
import { UnreachableStatementError } from '@ts-core/common/error';
import { PromiseReflector } from '@ts-core/common/promise';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class CoinTransferHandler extends TransportCommandFabricAsyncHandler<ICoinTransferDto, void, CoinTransferCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, private service: CoinService) {
        super(logger, transport, CoinTransferCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICoinTransferDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        switch (params.from.type) {
            case CoinObjectType.COMPANY:
                await rolesSomeOf(
                    PromiseReflector.create(rolesCompanyCheck(holder, params.from.uid, LedgerCompanyRole.COIN_MANAGER)),
                    PromiseReflector.create(rolesCompanyCheck(holder, params.from.uid, LedgerCompanyRole.USER_MANAGER))
                );
                break;
            case CoinObjectType.PROJECT:
                await rolesSomeOf(
                    PromiseReflector.create(rolesProjectCheck(holder, params.from.uid, LedgerProjectRole.COIN_MANAGER)),
                    PromiseReflector.create(rolesProjectCheck(holder, params.from.uid, LedgerProjectRole.USER_MANAGER))
                );
                break;
            default:
                throw new UnreachableStatementError(params.from.type);
        }

        await this.service.walletAmountBurn(holder, await this.service.getWallet(params.from, holder), params.amount);
        await this.service.walletAmountEmit(holder, await this.service.getWallet(params.to, holder), params.amount);
        await holder.stub.dispatch(new CoinTransferedEvent(holder.eventData));
    }
}
