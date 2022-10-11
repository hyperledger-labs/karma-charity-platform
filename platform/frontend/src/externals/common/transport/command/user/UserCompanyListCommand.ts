import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { ICompanyListDto, ICompanyListDtoResponse } from '../company';
import { LedgerCompany } from '../../../ledger/company';

export class UserCompanyListCommand extends KarmaTransportCommandAsync<IUserCompanyListDto, ICompanyListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.USER_COMPANY_LIST;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserCompanyListDto) {
        super(UserCompanyListCommand.NAME, request, null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(response: ICompanyListDtoResponse): ICompanyListDtoResponse {
        response.items = TransformUtil.toClassMany(LedgerCompany, response.items);
        return response;
    }
}

export interface IUserCompanyListDto extends ICompanyListDto {
    userUid: string;
}
