import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import { TransformUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { UserGetCommand, IUserGetDto } from '@project/common/transport/command/user';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { LedgerUser } from '@project/common/ledger/user';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class UserGetHandler extends TransportCommandFabricAsyncHandler<IUserGetDto, LedgerUser, UserGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, UserGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private MethodsU
    //
    // --------------------------------------------------------------------------

    @UserGuard({ isNeedCheck: false })
    protected async execute(params: IUserGetDto, @StubHolder() holder: IUserStubHolder): Promise<LedgerUser> {
        let item = await holder.db.user.get(params.uid, params.details);
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find user "${params.uid}"`);
        }
        return item;
    }

    protected checkResponse(response: LedgerUser): LedgerUser {
        return TransformUtil.fromClass(response);
    }
}
