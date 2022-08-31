import { Injectable } from '@nestjs/common';
import { Logger, TransformUtil, PaginableBookmark, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { UserCompanyListCommand, IUserCompanyListDto } from '@project/common/transport/command/user';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { ICompanyListDtoResponse } from '@project/common/transport/command/company';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class UserCompanyListHandler extends TransportCommandFabricAsyncHandler<IUserCompanyListDto, ICompanyListDtoResponse, UserCompanyListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, UserCompanyListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IUserCompanyListDto, @StubHolder() holder: IUserStubHolder): Promise<ICompanyListDtoResponse> {
        return holder.db.user.companyList(params.userUid, params);
    }

    protected checkResponse(response: ICompanyListDtoResponse): ICompanyListDtoResponse {
        response.items = TransformUtil.fromClassMany(response.items);
        return response;
    }

    protected checkRequest(request: IUserCompanyListDto): IUserCompanyListDto {
        return PaginableBookmark.transform(request) as IUserCompanyListDto;
    }
}
