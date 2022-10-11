import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { ICoinObject, CoinObject } from './ICoinObject';
import { ICoinAmount, CoinAmount } from './ICoinAmount';
import { ILedgerPaymentDetails, LedgerPaymentDetails } from '../../../ledger/payment';

export class CoinTransferCommand extends KarmaTransportCommandAsync<ICoinTransferDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COIN_TRANSFER;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICoinTransferDto) {
        super(CoinTransferCommand.NAME, TransformUtil.toClass(CoinTransferDto, request));
    }
}

export interface ICoinTransferDto extends ITraceable {
    to: ICoinObject;
    from: ICoinObject;
    amount: ICoinAmount;
    details: ILedgerPaymentDetails;
}

class CoinTransferDto implements ICoinTransferDto {
    @Type(() => CoinObject)
    @IsDefined()
    @ValidateNested()
    to: CoinObject;

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
