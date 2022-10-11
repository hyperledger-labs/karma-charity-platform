import { TransportCommand } from '@ts-core/common';

export class VkExternalLogoutCommand extends TransportCommand<void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'VkExternalLogoutCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(VkExternalLogoutCommand.NAME);
    }
}
