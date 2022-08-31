import { Injectable } from '@nestjs/common';
import { Logger, Transport, TransformUtil, PaginableBookmark } from '@ts-core/common';
import * as _ from 'lodash';
import { ProjectUserListCommand, IProjectUserListDto } from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { IUserListDtoResponse } from '@project/common/transport/command/user';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class ProjectUserListHandler extends TransportCommandFabricAsyncHandler<IProjectUserListDto, IUserListDtoResponse, ProjectUserListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, ProjectUserListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IProjectUserListDto, @StubHolder() holder: IUserStubHolder): Promise<IUserListDtoResponse> {
        return holder.db.project.userList(params.projectUid, params);
    }

    protected checkResponse(response: IUserListDtoResponse): IUserListDtoResponse {
        response.items = TransformUtil.fromClassMany(response.items);
        return response;
    }

    protected checkRequest(request: IProjectUserListDto): IProjectUserListDto {
        return PaginableBookmark.transform(request) as IProjectUserListDto;
    }
}
