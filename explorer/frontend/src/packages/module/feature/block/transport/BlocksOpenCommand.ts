import { LedgerBlock } from '@hlf-explorer/common/ledger';
import { TransportCommand } from '@ts-core/common/transport';

export class BlocksOpenCommand extends TransportCommand<void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'BlocksOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(BlocksOpenCommand.NAME);
    }
}
