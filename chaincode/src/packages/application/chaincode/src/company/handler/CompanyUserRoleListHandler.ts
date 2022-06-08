import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { CompanyUserRoleListCommand, ICompanyUserRoleListDtoResponse, ICompanyUserRoleListDto } from '@project/common/transport/command/company';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class CompanyUserRoleListHandler extends TransportCommandFabricAsyncHandler<
    ICompanyUserRoleListDto,
    ICompanyUserRoleListDtoResponse,
    CompanyUserRoleListCommand
> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
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
