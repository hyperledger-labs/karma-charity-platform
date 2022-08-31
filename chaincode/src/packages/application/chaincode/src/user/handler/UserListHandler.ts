import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransformUtil, PaginableBookmark } from '@ts-core/common';
import * as _ from 'lodash';
import { UserListCommand, IUserListDto, IUserListDtoResponse } from '@project/common/transport/command/user';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { TransportCommandFabricAsyncHandler, StubHolder } from '@hlf-core/transport-chaincode';

@Injectable()
export class UserListHandler extends TransportCommandFabricAsyncHandler<IUserListDto, IUserListDtoResponse, UserListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, UserListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IUserListDto, @StubHolder() holder: IUserStubHolder): Promise<IUserListDtoResponse> {
        return holder.db.user.findPaginated(params);
    }

    protected checkResponse(response: IUserListDtoResponse): IUserListDtoResponse {
        response.items = TransformUtil.fromClassMany(response.items);
        return response;
    }

    protected checkRequest(params: IUserListDto): IUserListDto {
        return PaginableBookmark.transform(params);
    }
}
