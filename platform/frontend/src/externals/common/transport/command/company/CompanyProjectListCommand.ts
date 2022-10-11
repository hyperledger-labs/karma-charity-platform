import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { IProjectListDtoResponse, IProjectListDto } from '../project';
import { LedgerProject } from '../../../ledger/project';

export class CompanyProjectListCommand extends KarmaTransportCommandAsync<ICompanyProjectListDto, IProjectListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_PROJECT_LIST;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyProjectListDto) {
        super(CompanyProjectListCommand.NAME, request, null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(response: IProjectListDtoResponse): IProjectListDtoResponse {
        response.items = TransformUtil.toClassMany(LedgerProject, response.items);
        return response;
    }
}

export interface ICompanyProjectListDto extends IProjectListDto {
    companyUid: string;
}
