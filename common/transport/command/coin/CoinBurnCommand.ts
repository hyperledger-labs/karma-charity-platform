import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { ICoinObject, CoinObject } from './ICoinObject';
import { ICoinAmount, CoinAmount } from './ICoinAmount';
import { ILedgerPaymentDetails, LedgerPaymentDetails } from '../../../ledger/payment';
import { ITraceable } from '@ts-core/common';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

export class CoinBurnCommand extends KarmaTransportCommandAsync<ICoinBurnDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COIN_BURN;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinBurnDto) {
        super(CoinBurnCommand.NAME, TransformUtil.toClass(CoinBurnDto, request));
    }
}

export interface ICoinBurnDto extends ITraceable {
    from: ICoinObject;
    amount: ICoinAmount;
    details: ILedgerPaymentDetails;
}

export class CoinBurnDto implements ICoinBurnDto {
    @Type(() => CoinObject)
    @IsDefined()
    @ValidateNested()
    from: CoinObject;

    @Type(() => CoinAmount)
    @IsDefined()
    @ValidateNested()
    amount: CoinAmount;

    @Type(() => LedgerPaymentDetails)
    @IsDefined()
    @ValidateNested()
    details: LedgerPaymentDetails;
}
