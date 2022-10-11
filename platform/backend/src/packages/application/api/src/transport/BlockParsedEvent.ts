import { TransportEvent } from '@ts-core/common';
import { LedgerBlock } from '@hlf-explorer/common';

export class BlockParsedEvent extends TransportEvent<LedgerBlock> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'BlockParsedEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: LedgerBlock) {
        super(BlockParsedEvent.NAME, data);
    }
}
