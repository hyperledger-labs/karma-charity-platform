import { LedgerCoinId } from "@project/common/ledger/coin";
import { AccountType } from "@project/common/platform/account";
import { IProjectBalance } from "@project/common/platform/project";
import { AccountEntity } from "@project/module/database/account";
import { ProjectEntity } from "@project/module/database/project";
import { MathUtil } from "@ts-core/common/util";
import * as _ from 'lodash';

export class ProjectUtil {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static checkRequiredAccounts(item: ProjectEntity): void {
        let map = new Map<LedgerCoinId, string>()
        for (let purpose of item.purposes) {
            let coinId = purpose.coinId;
            if (!map.has(coinId)) {
                map.set(coinId, '0');
            }
            map.set(coinId, MathUtil.add(map.get(coinId), purpose.amount));
        }

        map.forEach((amount, coinId) => {
            let account = _.find(item.accounts, { type: AccountType.REQUIRED, coinId });
            if (!_.isNil(account)) {
                account.amount = amount;
            }
            else {
                item.accounts.push(new AccountEntity(AccountType.REQUIRED, coinId, null, item.id, amount));
            }
        })
    }

    public static getBalance(project: ProjectEntity): IProjectBalance {
        if (_.isEmpty(project.accounts)) {
            return null;
        }

        let item: IProjectBalance = {} as any;
        for (let account of project.accounts) {
            if (account.type === AccountType.COLLECTED) {
                if (_.isNil(item.collected)) {
                    item.collected = {} as any;
                }
                item.collected[account.coinId] = account.amount
            }
            else if (account.type === AccountType.REQUIRED) {
                if (_.isNil(item.required)) {
                    item.required = {} as any;
                }
                item.required[account.coinId] = account.amount
            }
        }
        return item;
    }
}
