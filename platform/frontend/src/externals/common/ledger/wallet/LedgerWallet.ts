import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IUIDable } from '@ts-core/common';
import { LedgerWalletAccount } from './LedgerWalletAccount';
import { LedgerCoinId } from '../coin';
import * as _ from 'lodash';
import { Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'WalletAccount', async: false })
export class WalletAccountValidator implements ValidatorConstraintInterface {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    public validate(value: Array<LedgerWalletAccount>, args: ValidationArguments): Promise<boolean> | boolean {
        if (_.isEmpty(value)) {
            return true;
        }
        let unique = _.uniqBy(value, item => item.coinId);
        return value.length === unique.length;
    }

    public defaultMessage(args: ValidationArguments): string {
        return 'Wallet accounts must have unique coinId';
    }
}

export class LedgerWallet implements IUIDable {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = 'wallet';

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @IsString()
    public uid: string;

    @Validate(WalletAccountValidator)
    @Type(() => LedgerWalletAccount)
    public accounts: Array<LedgerWalletAccount>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public getAccount(coinId: LedgerCoinId): LedgerWalletAccount {
        return !_.isEmpty(this.accounts) ? _.find(this.accounts, item => item.coinId === coinId) : null;
    }

    public isEmpty(): boolean {
        return _.isEmpty(this.accounts) || this.accounts.every(item => _.isNil(item.value) || item.value === '0');
    }
}
