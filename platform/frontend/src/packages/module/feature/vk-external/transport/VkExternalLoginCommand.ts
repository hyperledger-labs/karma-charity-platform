import { TransportCommandAsync } from '@ts-core/common';
import { ILoginDto } from '@common/platform/api/login';

export class VkExternalLoginCommand extends TransportCommandAsync<void, ILoginDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'VkExternalLoginCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(VkExternalLoginCommand.NAME);
    }
}
