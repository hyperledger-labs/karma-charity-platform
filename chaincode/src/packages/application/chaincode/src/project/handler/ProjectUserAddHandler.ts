import { Injectable } from '@nestjs/common';
import { Logger, PromiseReflector, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { ProjectUserAddCommand, IProjectUserAddDto } from '@project/common/transport/command/project';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { UserGuard, IUserStubHolder, rolesSomeOf, rolesCheck, rolesProjectCheck } from '@project/module/core/guard';
import { ProjectService } from '../service/ProjectService';
import { LedgerProjectRole, LedgerRole } from '@project/common/ledger/role';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class ProjectUserAddHandler extends TransportCommandFabricAsyncHandler<IProjectUserAddDto, void, ProjectUserAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: ProjectService) {
        super(logger, transport, ProjectUserAddCommand.NAME);
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

        if (!(await holder.db.user.has(params.userUid))) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find user ${params.userUid}`);
        }

        if (!(await holder.db.project.has(params.projectUid))) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find project ${params.projectUid}`);
        }

        await this.service.userAdd(holder, params.projectUid, params.userUid, params.roles);
    }
}
