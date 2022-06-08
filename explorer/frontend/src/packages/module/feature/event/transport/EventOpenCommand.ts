import { LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import { TransportCommand } from '@ts-core/common/transport';

export class EventOpenCommand extends TransportCommand<IEventOpenDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'EventOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IEventOpenDto) {
        super(EventOpenCommand.NAME, request);
    }
}

export type IEventOpenDto = LedgerBlockEvent | string;
