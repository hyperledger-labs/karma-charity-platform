import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { ICompanyUserIsInDto, ICompanyUserIsInDtoResponse } from '@project/common/transport/command/company';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';
import { CompanyUserIsInCommand } from '@project/common/transport/command/company';

@Injectable()
export class CompanyUserIsInHandler extends TransportCommandFabricAsyncHandler<ICompanyUserIsInDto, ICompanyUserIsInDtoResponse, CompanyUserIsInCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, CompanyUserIsInCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyUserIsInDto, @StubHolder() holder: IUserStubHolder): Promise<ICompanyUserIsInDtoResponse> {
        return holder.db.user.companyIsIn(params.userUid, params.companyUid);
    }
}
