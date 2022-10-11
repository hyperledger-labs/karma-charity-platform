import { IsEnum, Length, IsDate, Matches, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { RegExpUtil, ValidateUtil } from '../../util';
import { LedgerWallet } from '../wallet';
import * as _ from 'lodash';
import { ILedgerObject } from '../ILedgerObject';

export enum LedgerCompanyStatus {
    ACTIVE = 'ACTIVE',
    NON_ACTIVE = 'NON_ACTIVE'
}

export class LedgerCompany implements ILedgerObject {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = 'company';
    public static UID_REGXP = new RegExp(`${LedgerCompany.PREFIX}/${RegExpUtil.DATE_TIME}/${RegExpUtil.TRANSACTION_HASH}$`, 'i');

    private static MAX_CREATED_DATE = new Date(2500, 0);

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static createRoot(): LedgerCompany {
        return LedgerCompany.create(new Date(2000, 0), _.padStart('0', 64, '0'));
    }

    public static create(createdDate: Date, transactionHash: string): LedgerCompany {
        let item = new LedgerCompany();
        item.uid = LedgerCompany.createUid(createdDate, transactionHash);
        item.createdDate = createdDate;
        return item;
    }

    private static createUid(createdDate: Date, transactionHash: string): string {
        let time = LedgerCompany.MAX_CREATED_DATE.getTime() - createdDate.getTime();
        return `${LedgerCompany.PREFIX}/${_.padStart(time.toString(), 14, '0')}/${transactionHash}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @Matches(LedgerCompany.UID_REGXP)
    uid: string;

    @IsEnum(LedgerCompanyStatus)
    status: LedgerCompanyStatus;

    @Type(() => Date)
    @IsDate()
    createdDate: Date;

    @IsOptional()
    @Length(ValidateUtil.DESCRIPTION_MIN_LENGTH, ValidateUtil.DESCRIPTION_MAX_LENGTH)
    @Matches(RegExpUtil.DESCRIPTION)
    description?: string;

    @IsOptional()
    @Type(() => LedgerWallet)
    wallet: LedgerWallet;
}
