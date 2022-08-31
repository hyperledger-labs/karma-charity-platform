import { Injectable } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { CompanyUserRoleListCommand, ICompanyUserRoleListDtoResponse, ICompanyUserRoleListDto } from '@project/common/transport/command/company';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class CompanyUserRoleListHandler extends TransportCommandFabricAsyncHandler<ICompanyUserRoleListDto, ICompanyUserRoleListDtoResponse, CompanyUserRoleListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, CompanyUserRoleListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyUserRoleListDto, @StubHolder() holder: IUserStubHolder): Promise<ICompanyUserRoleListDtoResponse> {
        return holder.db.company.userRoleList(params.companyUid, params.userUid);
    }
}
