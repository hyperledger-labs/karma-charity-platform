import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { ExtendedError } from '@ts-core/common/error';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { LoginResource } from '@project/common/platform/api/login';
import { UserCryptoKeyEntity, UserEntity } from '@project/module/database/user';
import { GoogleStrategy } from '../strategy';
import { DatabaseService } from '@project/module/database/service';
import { Transport } from '@ts-core/common/transport';
import { TweetNaCl, Ed25519 } from '@ts-core/common/crypto';
import { CryptoEncryptCommand } from '@project/module/crypto/transport';
import { CryptoKeyStatus, CryptoKeyType } from '@project/common/platform/crypto';
import { LoginUser } from './LoginService';
import { UserStatusInvalidError, UserUndefinedError } from '@project/module/core/middleware';

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
        if (_.isNil(user)) {
            throw new UserUndefinedError();
        }
        if (payload.status !== user.status) {
            throw new UserStatusInvalidError({ value: payload.status, expected: user.status });
        }
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