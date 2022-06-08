import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { LedgerWalletAccount, LedgerWallet } from '@project/common/ledger/wallet';
import { ICoinAmount, ICoinEmitDto, CoinObjectType, ICoinObject } from '@project/common/transport/command/coin';
import { MathUtil } from '@ts-core/common/util';
import { LedgerCoinId } from '@project/common/ledger/coin';
import { IUserStubHolder } from '@project/module/core/guard';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { LedgerCompanyStatus } from '@project/common/ledger/company';
import { LedgerProjectStatus } from '@project/common/ledger/project';
import { UnreachableStatementError } from '@ts-core/common/error';
import { UID } from '@ts-core/common/dto';

@Injectable()
export class CoinService extends LoggerWrapper {
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
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async walletAccountGet(holder: IUserStubHolder, wallet: UID, coinId: LedgerCoinId): Promise<LedgerWalletAccount> {
        let item = await holder.db.wallet.accountGet(wallet, coinId);
        if (_.isNil(item)) {
            item = holder.db.wallet.accountCreate(wallet, coinId, '0');
        }
        return item;
    }

    private async walletCheckAccount(holder: IUserStubHolder, item: LedgerWalletAccount): Promise<void> {
        if (MathUtil.lessThan(item.value, '0')) {
            throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Wallet account balance can't be less than zero`);
        }
        if (MathUtil.equals(item.value, '0')) {
            await holder.db.walletAccount.remove(item);
        } else {
            await holder.db.walletAccount.save(item);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async getWallet(source: ICoinObject, holder: IUserStubHolder): Promise<LedgerWallet> {
        let item: LedgerWallet = null;
        switch (source.type) {
            case CoinObjectType.COMPANY:
                let company = await holder.db.company.get(source.uid, ['wallet']);
                if (_.isNil(company)) {
                    throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Company ${source.uid} not found`);
                }
                if (company.status !== LedgerCompanyStatus.ACTIVE) {
                    throw new LedgerError(
                        LedgerErrorCode.FORBIDDEN,
                        `Company "${company.uid}" status is not ${LedgerCompanyStatus.ACTIVE}`
                    );
                }
                item = company.wallet;
                break;

            case CoinObjectType.PROJECT:
                let project = await holder.db.project.get(source.uid, ['wallet']);
                if (_.isNil(project)) {
                    throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Project ${source.uid} not found`);
                }
                if (project.status !== LedgerProjectStatus.ACTIVE) {
                    throw new LedgerError(
                        LedgerErrorCode.FORBIDDEN,
                        `Project "${project.uid}" status is not ${LedgerProjectStatus.ACTIVE}`
                    );
                }
                item = project.wallet;
                break;
            default:
                throw new UnreachableStatementError(source.type);
        }
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Wallet for ${source.type} (${source.uid}) not found`);
        }
        return item;
    }

    public async walletAmountEmit(holder: IUserStubHolder, wallet: UID, amount: ICoinAmount): Promise<void> {
        let item = await this.walletAccountGet(holder, wallet, amount.coinId);
        item.value = MathUtil.add(item.value, amount.value);
        await this.walletCheckAccount(holder, item);
    }

    public async walletAmountBurn(holder: IUserStubHolder, wallet: UID, amount: ICoinAmount): Promise<void> {
        let item = await this.walletAccountGet(holder, wallet, amount.coinId);
        item.value = MathUtil.subtract(item.value, amount.value);
        await this.walletCheckAccount(holder, item);
    }
}
