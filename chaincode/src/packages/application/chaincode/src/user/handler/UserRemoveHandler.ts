import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { UserRemoveCommand, IUserRemoveDto } from '@project/common/transport/command/user';
import { UserRemovedEvent } from '@project/common/transport/event/user';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { LedgerRole } from '@project/common/ledger/role';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class UserRemoveHandler extends TransportCommandFabricAsyncHandler<IUserRemoveDto, void, UserRemoveCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, UserRemoveCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IUserRemoveDto, @StubHolder() holder: IUserStubHolder): Promise<void> {
        await rolesCheck(holder, LedgerRole.USER_MANAGER);

        let item = await holder.db.user.get(params.uid);
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find user ${params.uid}`);
        }

        throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Unable to remove user: it's deprecated now`);

        await holder.db.user.remove(params.uid);
        await holder.stub.dispatch(new UserRemovedEvent(holder.eventData));
    }
}
