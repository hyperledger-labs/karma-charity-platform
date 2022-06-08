import { TransportEvent } from '@ts-core/common/transport';
import { LedgerBlock } from '@hlf-explorer/common/ledger';

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
