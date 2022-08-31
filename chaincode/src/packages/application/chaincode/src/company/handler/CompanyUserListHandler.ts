import { Injectable } from '@nestjs/common';
import { Logger, PaginableBookmark, TransformUtil, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { CompanyUserListCommand, ICompanyUserListDto } from '@project/common/transport/command/company';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { IUserListDtoResponse } from '@project/common/transport/command/user';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class CompanyUserListHandler extends TransportCommandFabricAsyncHandler<ICompanyUserListDto, IUserListDtoResponse, CompanyUserListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
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
