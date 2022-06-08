import { UserUid } from '@ts-core/angular';
import { TransportCommand } from '@ts-core/common/transport';

export class UserOpenCommand extends TransportCommand<UserUid> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'UserOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: UserUid) {
        super(UserOpenCommand.NAME, request);
    }
}
