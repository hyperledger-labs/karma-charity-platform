import { Injectable } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { ProjectEditCommand, IProjectEditDto } from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder, rolesCompanyCheck } from '@project/module/core/guard';
import { LedgerErrorCode, LedgerError } from '@project/common/ledger/error';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { ProjectEditedEvent } from '@project/common/transport/event/project';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class ProjectEditHandler extends TransportCommandFabricAsyncHandler<IProjectEditDto, void, ProjectEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, ProjectEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IProjectEditDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        let item = await holder.db.project.get(params.uid);
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find ${params.uid} project`);
        }

        await rolesCompanyCheck(holder, item.companyUid, LedgerCompanyRole.PROJECT_MANAGER);

        if (!_.isNil(params.description)) {
            await holder.db.project.descriptionSet(item, params.description);
        }

        await holder.stub.dispatch(new ProjectEditedEvent(holder.eventData));
    }
}
