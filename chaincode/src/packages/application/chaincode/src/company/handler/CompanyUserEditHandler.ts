import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { CompanyUserEditCommand, ICompanyUserAddDto } from '@project/common/transport/command/company';
import { UserGuard, IUserStubHolder, rolesSomeOf, rolesCheck, rolesCompanyCheck } from '@project/module/core/guard';
import { LedgerCompanyRole, LedgerRole } from '@project/common/ledger/role';
import { PromiseReflector } from '@ts-core/common/promise';
import { CompanyUserEditedEvent } from '@project/common/transport/event/company';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class CompanyUserEditHandler extends TransportCommandFabricAsyncHandler<ICompanyUserAddDto, void, CompanyUserEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
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
