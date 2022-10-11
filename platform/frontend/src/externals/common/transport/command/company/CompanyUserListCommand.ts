import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerUser } from '../../../ledger/user';
import { IUserListDtoResponse, IUserListDto } from '../user';

export class CompanyUserListCommand extends KarmaTransportCommandAsync<ICompanyUserListDto, IUserListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_USER_LIST;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyUserListDto) {
        super(CompanyUserListCommand.NAME, request, null, true);
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

export interface ICompanyUserListDto extends IUserListDto {
    companyUid: string;
}
