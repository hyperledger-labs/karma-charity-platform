import { ILoginDto } from '@project/common/platform/api/login';
import { TransportCommandAsync } from '@ts-core/common';

export class GoExternalLoginCommand extends TransportCommandAsync<void, ILoginDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'GoExternalLoginCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(GoExternalLoginCommand.NAME);
    }
}
