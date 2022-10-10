import { TransportEvent } from '@ts-core/common/transport';
import { LedgerBlock } from '@hlf-explorer/common/ledger';

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
