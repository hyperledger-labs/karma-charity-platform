import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { PaginableBookmark } from '@ts-core/common/dto';
import { UserCompanyListCommand, IUserCompanyListDto } from '@project/common/transport/command/user';
import { TransformUtil } from '@ts-core/common/util';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { ICompanyListDtoResponse } from '@project/common/transport/command/company';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class UserCompanyListHandler extends TransportCommandFabricAsyncHandler<IUserCompanyListDto, ICompanyListDtoResponse, UserCompanyListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
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
