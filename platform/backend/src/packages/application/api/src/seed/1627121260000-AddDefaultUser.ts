import { MigrationInterface, QueryRunner } from 'typeorm';
import * as _ from 'lodash';
import { UserCryptoKeyEntity, UserEntity, UserPreferencesEntity } from '@project/module/database/user';
import { UserType, UserStatus, UserPreferencesProjectCancelStrategy } from '@project/common/platform/user';
import { LoginService } from '@project/module/login/service';
import { LoginResource } from '@project/common/platform/api/login';
import { ValidateUtil } from '@ts-core/common/util';
import { Ed25519 } from '@ts-core/common/crypto';
import { CryptoKeyStatus } from '@project/common/platform/crypto';
import { ROOT_USER_CRYPTO_ALGORITHM, ROOT_USER_DESCRIPTION, ROOT_USER_CRYPTO_KEY_PRIVATE, ROOT_USER_CRYPTO_KEY_PUBLIC } from '@project/common/ledger';
import { LedgerUser } from '@project/common/ledger/user';
import { UserService } from '@project/module/login/service';

export class AddDefaultUser1627121260000 implements MigrationInterface {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static DEFAULT_LOGIN = LoginService.createLogin('111452810894131754642', LoginResource.GOOGLE);

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async up(queryRunner: QueryRunner): Promise<any> {
        let repository = queryRunner.connection.getRepository(UserEntity);
        let login = AddDefaultUser1627121260000.DEFAULT_LOGIN;

        let item = await repository.findOne({ login });
        if (!_.isNil(item)) {
            return;
        }

        item = new UserEntity();
        item.uid = UserService.uidCreate(login);
        item.type = UserType.ADMINISTRATOR;
        item.login = login;
        item.status = UserStatus.ACTIVE;
        item.resource = LoginResource.GOOGLE;
        item.ledgerUid = LedgerUser.createRoot().uid;

        let preferences = (item.preferences = new UserPreferencesEntity());
        preferences.name = 'Renat Gubaev';
        preferences.phone = '+79099790296';
        preferences.email = 'renat.gubaev@gmail.com';
        preferences.locale = 'ru';
        preferences.isMale = true;
        preferences.picture = 'https://lh3.googleusercontent.com/a-/AOh14Gi3OO8vUAOm95cVHW-JOIzidhXd8ywkxtXm3f6r=s96-c';
        preferences.description = 'Default Administrator'
        preferences.birthday = new Date(1986, 11, 7);
        preferences.location = 'Moscow, Russia';
        preferences.latitude = 0;
        preferences.longitude = 0;
        preferences.projectCancelStrategy = UserPreferencesProjectCancelStrategy.REFUND_TO_COMPANY;

        let cryptoKey = item.cryptoKey = new UserCryptoKeyEntity();
        cryptoKey.status = CryptoKeyStatus.ACTIVE;
        cryptoKey.algorithm = Ed25519.ALGORITHM;
        cryptoKey.publicKey = ROOT_USER_CRYPTO_KEY_PUBLIC;
        // We can't encrypt private key, because we don't know encryption key yet
        cryptoKey.privateKey = ROOT_USER_CRYPTO_KEY_PRIVATE;

        ValidateUtil.validate(item);
        await repository.save(item);
    }

    public async down(queryRunner: QueryRunner): Promise<any> { }
}
