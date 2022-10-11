import { TransportCommand } from '@ts-core/common';

export class GoExternalLogoutCommand extends TransportCommand<void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'GoExternalLogoutCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(GoExternalLogoutCommand.NAME);
    }
}
