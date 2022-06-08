import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { UserGuard, IUserStubHolder, rolesSomeOf, rolesCheck, rolesCompanyCheck } from '@project/module/core/guard';
import { ICompanyUserRemoveDto, CompanyUserRemoveCommand } from '@project/common/transport/command/company';
import { CompanyUserRemovedEvent } from '@project/common/transport/event/company';
import { LedgerCompanyRole, LedgerRole } from '@project/common/ledger/role';
import { PromiseReflector } from '@ts-core/common/promise';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class CompanyUserRemoveHandler extends TransportCommandFabricAsyncHandler<ICompanyUserRemoveDto, void, CompanyUserRemoveCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, CompanyUserRemoveCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyUserRemoveDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesSomeOf(
            PromiseReflector.create(rolesCheck(holder, LedgerRole.COMPANY_MANAGER)),
            PromiseReflector.create(rolesCompanyCheck(holder, params.companyUid, LedgerCompanyRole.USER_MANAGER))
        );

        let company = await holder.db.company.get(params.companyUid);
        if (_.isNil(company)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find company ${params.companyUid}`);
        }

        let user = await holder.db.user.get(params.userUid);
        if (_.isNil(user)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find user ${params.userUid}`);
        }

        await holder.db.user.companyRemove(params.userUid, params.companyUid);
        await holder.db.company.userRemove(params.companyUid, params.userUid);
        await holder.stub.dispatch(new CompanyUserRemovedEvent(holder.eventData));
    }
}
