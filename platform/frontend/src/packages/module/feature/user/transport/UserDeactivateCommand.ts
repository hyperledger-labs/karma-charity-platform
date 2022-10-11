import { UserUid } from '@ts-core/angular';
import { TransportCommandAsync } from '@ts-core/common';

export class UserDeactivateCommand extends TransportCommandAsync<UserUid, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'UserDeactivateCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: UserUid) {
        super(UserDeactivateCommand.NAME, request);
    }
}
