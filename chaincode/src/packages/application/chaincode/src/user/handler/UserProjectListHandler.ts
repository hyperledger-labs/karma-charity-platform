import { Injectable } from '@nestjs/common';
import { Logger, TransformUtil, PaginableBookmark, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { UserProjectListCommand, IUserProjectListDto } from '@project/common/transport/command/user';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { IProjectListDtoResponse } from '@project/common/transport/command/project';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';
import { StubHolder } from '@hlf-core/transport-chaincode';

@Injectable()
export class UserProjectListHandler extends TransportCommandFabricAsyncHandler<IUserProjectListDto, IProjectListDtoResponse, UserProjectListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, UserProjectListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IUserProjectListDto, @StubHolder() holder: IUserStubHolder): Promise<IProjectListDtoResponse> {
        return holder.db.user.projectList(params.userUid, params);
    }

    protected checkResponse(response: IProjectListDtoResponse): IProjectListDtoResponse {
        response.items = TransformUtil.fromClassMany(response.items);
        return response;
    }

    protected checkRequest(request: IUserProjectListDto): IUserProjectListDto {
        return PaginableBookmark.transform(request) as IUserProjectListDto;
    }
}
