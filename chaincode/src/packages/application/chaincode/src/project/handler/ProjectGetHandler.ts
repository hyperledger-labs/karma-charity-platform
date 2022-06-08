import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import { TransformUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { ProjectGetCommand, IProjectGetDto } from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { LedgerProject } from '@project/common/ledger/project';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class ProjectGetHandler extends TransportCommandFabricAsyncHandler<IProjectGetDto, LedgerProject, ProjectGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
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
