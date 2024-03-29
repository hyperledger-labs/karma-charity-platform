import { TransportEvent } from '@ts-core/common';
import { LedgerBlock } from '@hlf-explorer/common';

export class LedgerBlockParsedEvent extends TransportEvent<ILedgerBlockParsedDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'LedgerBlockParsedEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: ILedgerBlockParsedDto) {
        super(LedgerBlockParsedEvent.NAME, data);
    }
}

export interface ILedgerBlockParsedDto {
    ledgerId: number;
    block: LedgerBlock;
}
