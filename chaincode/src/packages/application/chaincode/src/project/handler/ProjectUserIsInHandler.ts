import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { IProjectUserIsInDto, IProjectUserIsInDtoResponse } from '@project/common/transport/command/project';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';
import { ProjectUserIsInCommand } from '@project/common/transport/command/project';

@Injectable()
export class ProjectUserIsInHandler extends TransportCommandFabricAsyncHandler<IProjectUserIsInDto, IProjectUserIsInDtoResponse, ProjectUserIsInCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, ProjectUserIsInCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IProjectUserIsInDto, @StubHolder() holder: IUserStubHolder): Promise<IProjectUserIsInDtoResponse> {
        return holder.db.user.projectIsIn(params.userUid, params.projectUid);
    }
}
