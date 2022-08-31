import { Injectable } from '@nestjs/common';
import { Transport, TransformUtil, Logger } from '@ts-core/common';
import * as _ from 'lodash';
import { ProjectGetCommand, IProjectGetDto } from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { LedgerProject } from '@project/common/ledger/project';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class ProjectGetHandler extends TransportCommandFabricAsyncHandler<IProjectGetDto, LedgerProject, ProjectGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, ProjectGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private MethodsU
    //
    // --------------------------------------------------------------------------

    @UserGuard({ isNeedCheck: false })
    protected async execute(params: IProjectGetDto, @StubHolder() holder: IUserStubHolder): Promise<LedgerProject> {
        let item = await holder.db.project.get(params.uid, params.details);
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find project "${params.uid}"`);
        }
        return item;
    }

    protected checkResponse(response: LedgerProject): LedgerProject {
        return TransformUtil.fromClass(response);
    }
}
