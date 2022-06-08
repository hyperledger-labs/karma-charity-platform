import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { IProjectRemoveDto, ProjectRemoveCommand } from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder, rolesCompanyCheck } from '@project/module/core/guard';
import { LedgerErrorCode, LedgerError } from '@project/common/ledger/error';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { ProjectRemovedEvent } from '@project/common/transport/event/project';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class ProjectRemoveHandler extends TransportCommandFabricAsyncHandler<IProjectRemoveDto, void, ProjectRemoveCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, ProjectRemoveCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IProjectRemoveDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        let item = await holder.db.project.get(params.uid, ['wallet']);
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find ${params.uid} project`);
        }

        await rolesCompanyCheck(holder, item.companyUid, LedgerCompanyRole.PROJECT_MANAGER);

        if (!item.wallet.isEmpty()) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to remove project ${params.uid}: wallet is not empty`);
        }

        throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Unable to remove project: it's deprecated now`);

        await holder.db.project.remove(item);
        await holder.stub.dispatch(new ProjectRemovedEvent(holder.eventData));
    }
}
