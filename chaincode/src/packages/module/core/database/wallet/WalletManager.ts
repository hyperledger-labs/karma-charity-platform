import { EntityManager } from '@hlf-core/transport/chaincode/database/entity';
import { TransformUtil, ValidateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { LedgerErrorCode, LedgerError } from '@project/common/ledger/error';
import { LedgerWallet } from '@project/common/ledger/wallet';
import { LedgerWalletAccount } from '@project/common/ledger/wallet';
import { WalletAccountManager } from './WalletAccountManager';
import { LedgerCoinId } from '@project/common/ledger/coin';
import { getUid, UID } from '@ts-core/common/dto';

export class WalletManager extends EntityManager<LedgerWallet> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private account: WalletAccountManager;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async loadDetails(item: LedgerWallet, details?: Array<keyof LedgerWallet>): Promise<void> {
        if (_.isEmpty(details)) {
            return;
        }

        if (_.isNil(item.accounts) && details.includes('accounts')) {
            item.accounts = await this.accountList(item);
        }
    }

    public async remove(wallet: UID): Promise<void> {
        await this.accountsRemove(wallet);
        super.remove(wallet);
    }

    public initialize(account: WalletAccountManager): void {
        this.account = account;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.account = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async deserialize(item: any): Promise<LedgerWallet> {
        if (_.isNil(item)) {
            return null;
        }
        let value = TransformUtil.toClass(LedgerWallet, item);
        ValidateUtil.validate(value);

        await this.loadDetails(value, ['accounts']);
        return value;
    }

    protected async serialize(item: LedgerWallet): Promise<any> {
        if (!(item instanceof LedgerWallet)) {
            throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Not instance of LedgerWallet`, item);
        }
        ValidateUtil.validate(item);

        delete item.accounts;
        return TransformUtil.fromClass(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Account Methods
    //
    // --------------------------------------------------------------------------

    public async accountList(wallet: UID): Promise<Array<LedgerWalletAccount>> {
        return this.account.getMany(await this.getKeys(this.getAccountUid(wallet)));
    }

    public accountGet(wallet: UID, coinId: LedgerCoinId): Promise<LedgerWalletAccount> {
        return this.account.get(this.getAccountUid(wallet, coinId));
    }

    public accountCreate(wallet: UID, coinId: LedgerCoinId, amount: string): LedgerWalletAccount {
        if (_.isNil(wallet) || _.isNil(coinId)) {
            return;
        }
        let item = new LedgerWalletAccount();
        item.uid = this.getAccountUid(wallet, coinId);
        item.value = amount;
        item.coinId = coinId;
        return item;
    }

    protected async accountsRemove(wallet: UID): Promise<void> {
        let kv = await this.getKV(this.getAccountUid(wallet));
        await Promise.all(kv.map(item => this.stub.removeState(item.key)));
    }

    protected getAccountUid(wallet: UID, coinId?: LedgerCoinId): string {
        let item = `→${this.prefix}~${this.account.prefix}:${getUid(wallet)}`;
        return !_.isNil(coinId) ? `${item}~${coinId}` : item;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get prefix(): string {
        return LedgerWallet.PREFIX;
    }
}
