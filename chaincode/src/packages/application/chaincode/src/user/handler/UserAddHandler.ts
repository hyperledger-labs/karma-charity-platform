import { Injectable } from '@nestjs/common';
import { TransformUtil, Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { LedgerUser } from '@project/common/ledger/user';
import { UserAddCommand, IUserAddDto, UserAddDto } from '@project/common/transport/command/user';
import { UserGuard, IUserStubHolder, rolesCheck } from '@project/module/core/guard';
import { UserService } from '../service/UserService';
import { LedgerRole } from '@project/common/ledger/role';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class UserAddHandler extends TransportCommandFabricAsyncHandler<IUserAddDto, LedgerUser, UserAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: UserService) {
        super(logger, transport, UserAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IUserAddDto, @StubHolder() holder: IUserStubHolder): Promise<LedgerUser> {
        await rolesCheck(holder, LedgerRole.USER_MANAGER);
        return this.service.add(holder, params);
    }

    protected checkRequest(request: IUserAddDto): IUserAddDto {
        return TransformUtil.toClass(UserAddDto, request);
    }

    protected checkResponse(response: LedgerUser): LedgerUser {
        return TransformUtil.fromClass(response);
    }
}
