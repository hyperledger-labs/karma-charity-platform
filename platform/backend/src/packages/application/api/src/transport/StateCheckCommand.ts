import { TransportCommand } from '@ts-core/common';

export class StateCheckCommand extends TransportCommand<void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'StateCheckCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(StateCheckCommand.NAME, null);
    }
}
