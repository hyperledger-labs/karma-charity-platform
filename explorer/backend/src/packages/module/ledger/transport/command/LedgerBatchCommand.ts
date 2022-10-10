import { ITraceable, TransportCommand } from '@ts-core/common';

export class LedgerBatchCommand extends TransportCommand<ILedgerBatchDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'LedgerBatchCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ILedgerBatchDto) {
        super(LedgerBatchCommand.NAME, request);
    }
}

export interface ILedgerBatchDto extends ITraceable {
    ledgerId: number;
}
