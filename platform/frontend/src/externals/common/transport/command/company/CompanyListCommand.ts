import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { IPaginationBookmark, PaginableBookmark } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { LedgerCompany } from '../../../ledger/company';

export class CompanyListCommand extends KarmaTransportCommandAsync<ICompanyListDto, ICompanyListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_LIST;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyListDto) {
        super(CompanyListCommand.NAME, request, null, true);
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

export interface ICompanyListDto extends PaginableBookmark<LedgerCompany>, ITraceable {}
export interface ICompanyListDtoResponse extends IPaginationBookmark<LedgerCompany> {}
