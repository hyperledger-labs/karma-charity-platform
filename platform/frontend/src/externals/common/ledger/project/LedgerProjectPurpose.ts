import * as _ from 'lodash';
import { IsEnum, Length, IsNumber, MaxLength, Matches } from 'class-validator';
import { LedgerCoinId } from '../coin';
import { RegExpUtil, ValidateUtil } from '../../util';

export interface ILedgerProjectPurpose {
    name: string;
    amount: string;
    decimals: number;
    coinId: LedgerCoinId;
}

export class LedgerProjectPurpose implements ILedgerProjectPurpose {
    @Length(ValidateUtil.PROJECT_PURPOSES_NAME_MIN_LENGTH, ValidateUtil.PROJECT_PURPOSES_NAME_MAX_LENGTH)
    @Matches(RegExpUtil.DESCRIPTION)
    name: string;

    @MaxLength(ValidateUtil.DESCRIPTION_MAX_LENGTH)
    amount: string;

    @IsNumber()
    decimals: number;

    @IsEnum(LedgerCoinId)
    coinId: LedgerCoinId;
}