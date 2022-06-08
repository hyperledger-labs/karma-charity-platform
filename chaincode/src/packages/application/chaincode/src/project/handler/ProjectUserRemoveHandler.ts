import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { UserGuard, IUserStubHolder, rolesSomeOf, rolesCheck, rolesProjectCheck } from '@project/module/core/guard';
import { IProjectUserRemoveDto, ProjectUserRemoveCommand } from '@project/common/transport/command/project';
import { ProjectUserRemovedEvent } from '@project/common/transport/event/project';
import { LedgerProjectRole, LedgerRole } from '@project/common/ledger/role';
import { PromiseReflector } from '@ts-core/common/promise';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class ProjectUserRemoveHandler extends TransportCommandFabricAsyncHandler<IProjectUserRemoveDto, void, ProjectUserRemoveCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, ProjectUserRemoveCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IProjectUserRemoveDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesSomeOf(
            PromiseReflector.create(rolesCheck(holder, LedgerRole.COMPANY_MANAGER)),
            PromiseReflector.create(rolesProjectCheck(holder, params.projectUid, LedgerProjectRole.USER_MANAGER))
        );

        let project = await holder.db.project.get(params.projectUid);
        if (_.isNil(project)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find project ${params.projectUid}`);
        }

        let user = await holder.db.user.get(params.userUid);
        if (_.isNil(user)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find user ${params.userUid}`);
        }

        await holder.db.user.projectRemove(params.userUid, params.projectUid);
        await holder.db.project.userRemove(params.projectUid, params.userUid);
        await holder.stub.dispatch(new ProjectUserRemovedEvent(holder.eventData));
    }
}
