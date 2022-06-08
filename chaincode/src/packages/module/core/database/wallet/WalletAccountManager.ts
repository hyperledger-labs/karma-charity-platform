import { EntityManager } from '@hlf-core/transport/chaincode/database/entity';
import { TransformUtil, ValidateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { LedgerWalletAccount } from '@project/common/ledger/wallet';

export class WalletAccountManager extends EntityManager<LedgerWalletAccount> {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async loadDetails(item: LedgerWalletAccount, details?: Array<keyof LedgerWalletAccount>): Promise<void> {}

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async deserialize(item: any, details?: Array<keyof LedgerWalletAccount>): Promise<LedgerWalletAccount> {
        if (_.isNil(item)) {
            return null;
        }
        let value = TransformUtil.toClass(LedgerWalletAccount, item);
        ValidateUtil.validate(value);

        await this.loadDetails(value, details);
        return value;
    }

    protected async serialize(item: LedgerWalletAccount): Promise<any> {
        if (!(item instanceof LedgerWalletAccount)) {
            throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Not instance of LedgerWalletAccount`, item);
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
        return LedgerWalletAccount.PREFIX;
    }
}
