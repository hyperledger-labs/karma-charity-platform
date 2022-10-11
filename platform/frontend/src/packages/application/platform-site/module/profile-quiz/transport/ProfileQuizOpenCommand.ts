import { TransportCommand } from '@ts-core/common';

export class ProfileQuizOpenCommand extends TransportCommand<void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProfileQuizCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(ProfileQuizOpenCommand.NAME);
    }
}
