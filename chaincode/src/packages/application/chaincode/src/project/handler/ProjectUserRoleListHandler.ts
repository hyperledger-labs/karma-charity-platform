import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import {
    ProjectUserRoleListCommand,
    IProjectUserRoleListDtoResponse,
    IProjectUserRoleListDto
} from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class ProjectUserRoleListHandler extends TransportCommandFabricAsyncHandler<
    IProjectUserRoleListDto,
    IProjectUserRoleListDtoResponse,
    ProjectUserRoleListCommand
> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, ProjectUserRoleListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(
        params: IProjectUserRoleListDto,
        @StubHolder() holder: IUserStubHolder
    ): Promise<IProjectUserRoleListDtoResponse> {
        return holder.db.project.userRoleList(params.projectUid, params.userUid);
    }
}
