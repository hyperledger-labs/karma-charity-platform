import { Injectable } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { CompanyRemovedEvent } from '@project/common/transport/event/company';
import { CompanyRemoveCommand, ICompanyRemoveDto } from '@project/common/transport/command/company';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { LedgerRole } from '@project/common/ledger/role';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class CompanyRemoveHandler extends TransportCommandFabricAsyncHandler<ICompanyRemoveDto, void, CompanyRemoveCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, CompanyRemoveCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyRemoveDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesCheck(holder, LedgerRole.COMPANY_MANAGER);

        let item = await holder.db.company.get(params.uid, ['wallet']);
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find company ${params.uid}`);
        }

        if (!item.wallet.isEmpty()) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to remove company ${params.uid}: wallet is not empty`);
        }

        throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Unable to remove company: it's deprecated now`);

        await holder.db.company.remove(params.uid);
        await holder.stub.dispatch(new CompanyRemovedEvent(holder.eventData));
    }
}
