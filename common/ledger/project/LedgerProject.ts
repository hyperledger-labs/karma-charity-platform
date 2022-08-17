import { IsEnum, Length, IsArray, IsDate, Matches, ArrayMinSize, ValidateNested, ArrayMaxSize, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { RegExpUtil, ValidateUtil } from '../../util';
import { LedgerWallet } from '../wallet';
import * as _ from 'lodash';
import { LedgerCompany } from '../company';
import { ILedgerObject } from '../ILedgerObject';
import { LedgerProjectPurpose } from './LedgerProjectPurpose';

export enum LedgerProjectStatus {
    ACTIVE = 'ACTIVE',
    NON_ACTIVE = 'NON_ACTIVE'
}

export class LedgerProject implements ILedgerObject {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = 'project';
    public static UID_REGXP = new RegExp(`${LedgerProject.PREFIX}/${RegExpUtil.DATE_TIME}/${RegExpUtil.TRANSACTION_HASH}$`, 'i');

    private static MAX_CREATED_DATE = new Date(2500, 0);

    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static create(createdDate: Date, transactionHash: string): LedgerProject {
        let item = new LedgerProject();
        item.uid = LedgerProject.createUid(createdDate, transactionHash);
        item.createdDate = createdDate;
        return item;
    }

    private static createUid(createdDate: Date, transactionHash: string): string {
        let time = LedgerProject.MAX_CREATED_DATE.getTime() - createdDate.getTime();
        return `${LedgerProject.PREFIX}/${_.padStart(time.toString(), 14, '0')}/${transactionHash}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @Matches(LedgerProject.UID_REGXP)
    uid: string;

    @Matches(LedgerCompany.UID_REGXP)
    companyUid: string;

    @IsEnum(LedgerProjectStatus)
    status: LedgerProjectStatus;

    @Type(() => Date)
    @IsDate()
    createdDate: Date;

    @IsOptional()
    @Length(ValidateUtil.DESCRIPTION_MIN_LENGTH, ValidateUtil.DESCRIPTION_MAX_LENGTH)
    @Matches(RegExpUtil.DESCRIPTION)
    description: string;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(ValidateUtil.PROJECT_PURPOSES_MIN_LENGTH)
    @ArrayMaxSize(ValidateUtil.PROJECT_PURPOSES_MAX_LENGTH)
    @Type(() => LedgerProjectPurpose)
    @ValidateNested({ each: true })
    purposes: Array<LedgerProjectPurpose>;

    @Type(() => LedgerWallet)
    wallet: LedgerWallet;
}

