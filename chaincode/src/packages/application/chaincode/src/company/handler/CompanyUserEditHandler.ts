import { Injectable } from '@nestjs/common';
import { Logger, PromiseReflector, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { CompanyUserEditCommand, ICompanyUserAddDto } from '@project/common/transport/command/company';
import { UserGuard, IUserStubHolder, rolesSomeOf, rolesCheck, rolesCompanyCheck } from '@project/module/core/guard';
import { LedgerCompanyRole, LedgerRole } from '@project/common/ledger/role';
import { CompanyUserEditedEvent } from '@project/common/transport/event/company';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class CompanyUserEditHandler extends TransportCommandFabricAsyncHandler<ICompanyUserAddDto, void, CompanyUserEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, CompanyUserEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyUserAddDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesSomeOf(
            PromiseReflector.create(rolesCheck(holder, LedgerRole.COMPANY_MANAGER)),
            PromiseReflector.create(rolesCompanyCheck(holder, params.companyUid, LedgerCompanyRole.USER_MANAGER))
        );

        if (!_.isNil(params.roles)) {
            await holder.db.company.userRoleSet(params.companyUid, params.userUid, params.roles);
        }
        await holder.stub.dispatch(new CompanyUserEditedEvent(holder.eventData));
    }
}
