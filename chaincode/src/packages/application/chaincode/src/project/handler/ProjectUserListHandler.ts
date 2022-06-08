import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { PaginableBookmark } from '@ts-core/common/dto';
import { ProjectUserListCommand, IProjectUserListDto } from '@project/common/transport/command/project';
import { TransformUtil } from '@ts-core/common/util';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { IUserListDtoResponse } from '@project/common/transport/command/user';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class ProjectUserListHandler extends TransportCommandFabricAsyncHandler<IProjectUserListDto, IUserListDtoResponse, ProjectUserListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
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
