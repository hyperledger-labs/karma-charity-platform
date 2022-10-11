import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { LedgerUser } from '../../../ledger/user';
import { Type } from 'class-transformer';
import { Matches, IsEnum, IsOptional, IsDefined, ValidateNested } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { ILedgerPaymentDetails, LedgerPaymentDetails } from '../../../ledger/payment';
import { ICoinObject, CoinObject } from './ICoinObject';
import { ICoinAmount, CoinAmount } from './ICoinAmount';

export class CoinEmitCommand extends KarmaTransportCommandAsync<ICoinEmitDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COIN_EMIT;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinEmitDto) {
        super(CoinEmitCommand.NAME, TransformUtil.toClass(CoinEmitDto, request));
    }

}

export enum CoinEmitType {
    DONATED = 'DONATED',
    FEE_AGGREGATOR_DEDUCTED = 'FEE_AGGREGATOR_DEDUCTED'
}

export interface ICoinEmitDto extends ITraceable {
    to: ICoinObject;
    type: CoinEmitType,
    from?: string;
    amount: ICoinAmount;
    details: ILedgerPaymentDetails;
}

class CoinEmitDto implements ICoinEmitDto {
    @Type(() => CoinObject)
    @IsDefined()
    @ValidateNested()
    to: CoinObject;

    @IsEnum(CoinEmitType)
    type: CoinEmitType;

    @IsOptional()
    @Matches(LedgerUser.UID_REGXP)
    from?: string;

    @Type(() => CoinAmount)
    @IsDefined()
    @ValidateNested()
    amount: CoinAmount;

    @Type(() => LedgerPaymentDetails)
    @IsDefined()
    @ValidateNested()
    details: LedgerPaymentDetails;
}
