import { Injectable } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { CompanyEditedEvent } from '@project/common/transport/event/company';
import { CompanyEditCommand, ICompanyEditDto } from '@project/common/transport/command/company';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { LedgerRole } from '@project/common/ledger/role';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class CompanyEditHandler extends TransportCommandFabricAsyncHandler<ICompanyEditDto, void, CompanyEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, CompanyEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyEditDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesCheck(holder, LedgerRole.COMPANY_MANAGER);

        let item = await holder.db.company.get(params.uid);
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find company ${params.uid}`);
        }

        if (!_.isNil(params.description)) {
            await holder.db.company.descriptionSet(item, params.description);
        }
        await holder.stub.dispatch(new CompanyEditedEvent(holder.eventData));
    }
}
