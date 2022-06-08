import { IUserEditDtoResponse } from 'common/platform/api/user';
import { UserUid } from '@ts-core/angular';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class UserEditCommand extends TransportCommandAsync<UserUid, IUserEditDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'UserEditCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: UserUid) {
        super(UserEditCommand.NAME, request);
    }
}
