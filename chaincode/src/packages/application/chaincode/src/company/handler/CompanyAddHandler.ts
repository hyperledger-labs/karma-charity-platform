import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import { TransformUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { LedgerCompany } from '@project/common/ledger/company';
import { CompanyAddCommand, ICompanyAddDto, CompanyAddDto } from '@project/common/transport/command/company';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { CompanyService } from '../service/CompanyService';
import { LedgerRole } from '@project/common/ledger/role';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class CompanyAddHandler extends TransportCommandFabricAsyncHandler<ICompanyAddDto, LedgerCompany, CompanyAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, private service: CompanyService) {
        super(logger, transport, CompanyAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyAddDto, @StubHolder() holder: IUserStubHolder): Promise<LedgerCompany> {
        await rolesCheck(holder, LedgerRole.COMPANY_MANAGER);

        if (!(await holder.db.user.has(params.ownerUid))) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find owner ${params.ownerUid}`);
        }
        return this.service.add(holder, params);
    }

    protected checkRequest(request: ICompanyAddDto): ICompanyAddDto {
        return TransformUtil.toClass(CompanyAddDto, request);
    }

    protected checkResponse(response: LedgerCompany): LedgerCompany {
        return TransformUtil.fromClass(response);
    }
}
