import { Injectable } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { UserEditCommand, IUserEditDto } from '@project/common/transport/command/user';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { LedgerRole } from '@project/common/ledger/role';
import { UserEditedEvent } from '@project/common/transport/event/user';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';
import { } from '@hlf-core/transport-chaincode';

@Injectable()
export class UserEditHandler extends TransportCommandFabricAsyncHandler<IUserEditDto, void, UserEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, UserEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IUserEditDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesCheck(holder, LedgerRole.USER_MANAGER);

        let item = await holder.db.user.get(params.uid);
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find user ${params.uid}`);
        }

        if (!_.isNil(params.description)) {
            await holder.db.user.descriptionSet(item, params.description);
        }

        if (!_.isNil(params.roles)) {
            await holder.db.user.roleSet(item, params.roles);
        }
        await holder.stub.dispatch(new UserEditedEvent(holder.eventData));
    }
}
