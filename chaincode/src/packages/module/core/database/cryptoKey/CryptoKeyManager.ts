import { EntityManager } from '@hlf-core/transport/chaincode/database/entity';
import { TransformUtil, ValidateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { LedgerCryptoKey } from '@project/common/ledger/cryptoKey';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';

export class CryptoKeyManager extends EntityManager<LedgerCryptoKey> {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async loadDetails(item: LedgerCryptoKey, details?: Array<keyof LedgerCryptoKey>): Promise<void> {}

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async deserialize(item: any, details?: Array<keyof LedgerCryptoKey>): Promise<LedgerCryptoKey> {
        if (_.isNil(item)) {
            return null;
        }
        let value = TransformUtil.toClass(LedgerCryptoKey, item);
        ValidateUtil.validate(value);

        await this.loadDetails(value, details);
        return value;
    }

    protected async serialize(item: LedgerCryptoKey): Promise<any> {
        if (!(item instanceof LedgerCryptoKey)) {
            throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Not instance of LedgerCryptoKey`, item);
        }
        ValidateUtil.validate(item);
        return TransformUtil.fromClass(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get prefix(): string {
        return LedgerCryptoKey.PREFIX;
    }
}
