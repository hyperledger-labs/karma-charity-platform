import { TransportCommandAsync } from '@ts-core/common/transport';
import { IUserEditDto, IUserEditDtoResponse } from '@common/platform/api/user';

export class UserSaveCommand extends TransportCommandAsync<IUserEditDto, IUserEditDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'UserSaveCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserEditDto) {
        super(UserSaveCommand.NAME, request);
    }
}
