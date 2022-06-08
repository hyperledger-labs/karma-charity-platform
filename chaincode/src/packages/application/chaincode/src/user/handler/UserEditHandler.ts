import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import { TransformUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { LedgerUser } from '@project/common/ledger/user';
import { UserEditCommand, IUserEditDto } from '@project/common/transport/command/user';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { LedgerRole } from '@project/common/ledger/role';
import { UserEditedEvent } from '@project/common/transport/event/user';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincode, TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class UserEditHandler extends TransportCommandFabricAsyncHandler<IUserEditDto, void, UserEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
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
