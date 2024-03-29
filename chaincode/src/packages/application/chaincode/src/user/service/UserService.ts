import { Injectable } from '@nestjs/common';
import { Logger, ObjectUtil, LoggerWrapper } from '@ts-core/common';
import { IUserStubHolder } from '@project/module/core/guard';
import { IUserAddDto } from '@project/common/transport/command/user';
import { LedgerUser, LedgerUserStatus } from '@project/common/ledger/user';
import { LedgerCryptoKey } from '@project/common/ledger/cryptoKey';
import { UserAddedEvent } from '@project/common/transport/event/user';
import * as _ from 'lodash';

@Injectable()
export class UserService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async add(holder: IUserStubHolder, params: IUserAddDto, isDefaultRootUser?: boolean): Promise<LedgerUser> {
        let item = !isDefaultRootUser ? LedgerUser.create(holder.stub.transactionDate, holder.stub.transactionHash) : LedgerUser.createRoot();
        item.status = LedgerUserStatus.ACTIVE;
        await holder.db.user.save(item);

        let cryptoKey = new LedgerCryptoKey();
        ObjectUtil.copyProperties(params.cryptoKey, cryptoKey);
        await holder.db.user.cryptoKeySet(item, cryptoKey);

        if (!_.isNil(params.description)) {
            await holder.db.user.descriptionSet(item, params.description);
        }
        if (!_.isEmpty(params.roles)) {
            await holder.db.user.roleSet(item, params.roles);
        }
        await holder.stub.dispatch(new UserAddedEvent(holder.eventData));
        return item;
    }
}
