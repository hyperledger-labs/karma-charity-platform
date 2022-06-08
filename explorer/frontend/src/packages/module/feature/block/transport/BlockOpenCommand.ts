import { LedgerBlock } from '@hlf-explorer/common/ledger';
import { TransportCommand } from '@ts-core/common/transport';

export class BlockOpenCommand extends TransportCommand<IBlockOpenDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'BlockOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IBlockOpenDto) {
        super(BlockOpenCommand.NAME, request);
    }
}

export type IBlockOpenDto = LedgerBlock | string | number;
