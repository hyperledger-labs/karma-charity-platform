import { TransportCommand } from '@ts-core/common/transport';

export class EventsOpenCommand extends TransportCommand<void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'EventsOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(EventsOpenCommand.NAME);
    }
}
