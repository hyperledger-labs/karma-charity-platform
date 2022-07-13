import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { Ed25519 } from '@ts-core/common/crypto';
import { ExtendedError } from '@ts-core/common/error';
import { Transport } from '@ts-core/common/transport';
import { DatabaseService } from '@project/module/database/service';
import * as _ from 'lodash';
import { AddDefaultUser1627121260000 } from '../seed/1627121260000-AddDefaultUser';
import { UserCryptoKeyEntity, UserEntity } from '@project/module/database/user';
import { CryptoDecryptCommand, CryptoEncryptCommand } from '@project/module/crypto/transport';
import { CryptoKeyType } from '@project/common/platform/crypto';
import { ValidateUtil, RandomUtil } from '@ts-core/common/util';
import { UserCryptoKeyChangeCommand, UserGetCommand } from '@project/common/transport/command/user';
import { ROOT_USER_CRYPTO_KEY_PRIVATE, ROOT_USER_CRYPTO_KEY_PUBLIC } from '@project/common/ledger';
import { LedgerApiClient } from '@project/module/core/service';
import { TransportCommandAsync, TransportCommand, ITransportCommandOptions } from '@ts-core/common/transport';
import { TransportCryptoManagerEd25519 } from '@ts-core/common/transport/crypto';
import { CompanyAddCommand } from '@project/common/transport/command/company';
import { ProjectCollectedCheckCommand } from '@project/module/project/transport';
import { LedgerService } from '@project/module/ledger/service';
import { CompanyEntity } from '@project/module/database/company';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { ProjectAddCommand } from '@project/common/transport/command/project';
import { LedgerCoinId } from '@project/common/ledger/coin';

@Injectable()
export class InitializeService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------



    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        logger: Logger,
        private transport: Transport,
        private database: DatabaseService,
        private ledger: LedgerService,
        private api: LedgerApiClient
    ) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async userRootCheck(): Promise<void> {
        let userRoot = await this.ledger.userRootGet();
        if (_.isNil(userRoot)) {
            throw new ExtendedError(`Unable to find default user: please seed database`);
        }

        let userRootLedger = await this.ledger.userRootLegerGet();
        if (_.isNil(userRootLedger)) {
            throw new ExtendedError(`Unable to find default ledger user: please check ledger chaincode`);
        }

        if (userRootLedger.cryptoKey.value !== userRoot.cryptoKey.publicKey) {
            throw new ExtendedError(`Ledger root user has different key from the default user: probably it was changed directly`);
        }
        this.log(`User root was founded`);
        /*
        let cryptoKey = user.cryptoKey;
        if (cryptoKey.publicKey !== ROOT_USER_CRYPTO_KEY_PUBLIC) {
            this.log(`Ledger root user crypto key matches default user key`);
            return;
        }
        this.log(`Ledger root user has default crypto key: changing it...`);

        let keys = Ed25519.keys();
        let algorithm = Ed25519.ALGORITHM;

        this.api.setSigner({ uid, isDisableDecryption: true });
        await this.api.ledgerRequestSendListen(new UserCryptoKeyChangeCommand({ uid, cryptoKey: { algorithm, value: keys.publicKey } }));

        cryptoKey.algorithm = Ed25519.ALGORITHM;
        cryptoKey.publicKey = keys.publicKey;
        cryptoKey.privateKey = await this.transport.sendListen(new CryptoEncryptCommand({ type: CryptoKeyType.DATABASE, value: keys.privateKey }));

        ValidateUtil.validate(cryptoKey);
        await this.database.userCryptoKey.save(cryptoKey);
        this.log(`Ledger root user default crypto key changed successfully`);
        */
    }

    private async companyPaymentAggregatorCheck(): Promise<void> {
        for (let name of Object.values(PaymentAggregatorType)) {
            let item = await this.ledger.companyPaymentAggregatorGet(name);
            if (!_.isNil(item)) {
                this.log(`Company for "${name}" payment aggregator was founded`);
                continue;
            }

            this.log(`Creating company for "${name}" payment aggregator...`);
            item = await this.ledger.companyPaymentAggregatorAdd(name);
            this.log(`Company for "${name}" payment aggregator created`);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async initialize(): Promise<void> {
        await this.userRootCheck();
        await this.companyPaymentAggregatorCheck();
    }
}
