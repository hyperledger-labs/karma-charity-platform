import { LoginUser } from '@project/common/platform/api/login';
import { TransportCommandAsync } from '@ts-core/common';


export class VkExternalUserGetCommand extends TransportCommandAsync<void, LoginUser> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'VkExternalUserGetCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(VkExternalUserGetCommand.NAME);
    }
}
