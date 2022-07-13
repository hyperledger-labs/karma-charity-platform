import { LedgerCoinId } from '../../../ledger/coin';
import { IsString, IsNumber, IsEnum } from 'class-validator';

export interface ICoinAmount {
    value: string;
    decimals: number;
    coinId: LedgerCoinId;
}

export class CoinAmount implements ICoinAmount {
    @IsString()
    value: string;

    @IsNumber()
    decimals: number;

    @IsEnum(LedgerCoinId)
    coinId: LedgerCoinId;
}
