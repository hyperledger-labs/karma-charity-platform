import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { IPaginationBookmark, PaginableBookmark } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { LedgerUser } from '../../../ledger/user';

export class UserListCommand extends KarmaTransportCommandAsync<IUserListDto, IUserListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.USER_LIST;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserListDto) {
        super(UserListCommand.NAME, request, null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(response: IUserListDtoResponse): IUserListDtoResponse {
        response.items = TransformUtil.toClassMany(LedgerUser, response.items);
        return response;
    }
}

export interface IUserListDto extends PaginableBookmark<LedgerUser>, ITraceable {}
export interface IUserListDtoResponse extends IPaginationBookmark<LedgerUser> {}
