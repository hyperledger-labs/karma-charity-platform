import { Injectable } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import {
    ProjectUserRoleListCommand,
    IProjectUserRoleListDtoResponse,
    IProjectUserRoleListDto
} from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class ProjectUserRoleListHandler extends TransportCommandFabricAsyncHandler<IProjectUserRoleListDto, IProjectUserRoleListDtoResponse, ProjectUserRoleListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
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
