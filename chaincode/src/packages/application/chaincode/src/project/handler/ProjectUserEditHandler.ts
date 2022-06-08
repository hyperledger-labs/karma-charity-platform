import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { ProjectUserEditCommand, IProjectUserAddDto } from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder, rolesSomeOf, rolesCheck, rolesProjectCheck } from '@project/module/core/guard';
import { LedgerProjectRole, LedgerRole } from '@project/common/ledger/role';
import { PromiseReflector } from '@ts-core/common/promise';
import { ProjectUserEditedEvent } from '@project/common/transport/event/project';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class ProjectUserEditHandler extends TransportCommandFabricAsyncHandler<IProjectUserAddDto, void, ProjectUserEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, ProjectUserEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IProjectUserAddDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesSomeOf(
            PromiseReflector.create(rolesCheck(holder, LedgerRole.COMPANY_MANAGER)),
            PromiseReflector.create(rolesProjectCheck(holder, params.projectUid, LedgerProjectRole.USER_MANAGER))
        );

        if (!_.isNil(params.roles)) {
            await holder.db.project.userRoleSet(params.projectUid, params.userUid, params.roles);
        }
        await holder.stub.dispatch(new ProjectUserEditedEvent(holder.eventData));
    }
}
