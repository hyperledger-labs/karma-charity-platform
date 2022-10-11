import { TransportCommandAsync } from '@ts-core/common';

export class LoginOpenCommand extends TransportCommandAsync<void, ILoginOpenDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'LoginOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(LoginOpenCommand.NAME);
    }
}

export interface ILoginOpenDtoResponse {}
