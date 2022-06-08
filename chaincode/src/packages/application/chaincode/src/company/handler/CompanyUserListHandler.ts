import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { PaginableBookmark } from '@ts-core/common/dto';
import { CompanyUserListCommand, ICompanyUserListDto } from '@project/common/transport/command/company';
import { TransformUtil } from '@ts-core/common/util';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { IUserListDtoResponse } from '@project/common/transport/command/user';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class CompanyUserListHandler extends TransportCommandFabricAsyncHandler<ICompanyUserListDto, IUserListDtoResponse, CompanyUserListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, CompanyUserListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyUserListDto, @StubHolder() holder: IUserStubHolder): Promise<IUserListDtoResponse> {
        return holder.db.company.userList(params.companyUid, params);
    }

    protected checkResponse(response: IUserListDtoResponse): IUserListDtoResponse {
        response.items = TransformUtil.fromClassMany(response.items);
        return response;
    }

    protected checkRequest(request: ICompanyUserListDto): ICompanyUserListDto {
        return PaginableBookmark.transform(request) as ICompanyUserListDto;
    }
}
