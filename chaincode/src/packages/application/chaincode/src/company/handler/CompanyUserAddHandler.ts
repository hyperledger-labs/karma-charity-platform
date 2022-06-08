import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { CompanyUserAddCommand, ICompanyUserAddDto } from '@project/common/transport/command/company';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { UserGuard, IUserStubHolder, rolesSomeOf, rolesCheck, rolesCompanyCheck } from '@project/module/core/guard';
import { CompanyService } from '../service/CompanyService';
import { LedgerCompanyRole, LedgerRole } from '@project/common/ledger/role';
import { PromiseReflector } from '@ts-core/common/promise';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class CompanyUserAddHandler extends TransportCommandFabricAsyncHandler<ICompanyUserAddDto, void, CompanyUserAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, private service: CompanyService) {
        super(logger, transport, CompanyUserAddCommand.NAME);
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
        
        if (!(await holder.db.user.has(params.userUid))) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find user ${params.userUid}`);
        }

        if (!(await holder.db.company.has(params.companyUid))) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find company ${params.companyUid}`);
        }

        await this.service.userAdd(holder, params.companyUid, params.userUid, params.roles);
    }
}
