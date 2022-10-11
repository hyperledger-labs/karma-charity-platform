import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common';
import * as _ from 'lodash';
import { UserCryptoKeyEntity, UserEntity } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { Transport } from '@ts-core/common';
import { TweetNaCl, Ed25519 } from '@ts-core/common';
import { CryptoEncryptCommand } from '@project/module/crypto/transport';
import { CryptoKeyStatus, CryptoKeyType } from '@project/common/platform/crypto';
import { LoginUser } from './LoginService';
import { UserGuard } from '@project/module/guard';
import { UserStatus } from '@project/common/platform/user';

@Injectable()
export class UserService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static uidCreate(login: string): string {
        return `@${TweetNaCl.hash(login)}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async validate(payload: LoginUser): Promise<UserEntity> {
        let user = await this.database.userGet(payload.id);
        UserGuard.checkUser({ isRequired: true, status: [UserStatus.ACTIVE] }, user);
        return Promise.resolve(user);
    }

    public async cryptoKeyCreate(): Promise<UserCryptoKeyEntity> {
        let keys = Ed25519.keys();
        let item = new UserCryptoKeyEntity();
        item.status = CryptoKeyStatus.ACTIVE;
        item.algorithm = Ed25519.ALGORITHM;
        item.publicKey = keys.publicKey;
        item.privateKey = await this.transport.sendListen(new CryptoEncryptCommand({ type: CryptoKeyType.DATABASE, value: keys.privateKey }));
        return item;
    }

}