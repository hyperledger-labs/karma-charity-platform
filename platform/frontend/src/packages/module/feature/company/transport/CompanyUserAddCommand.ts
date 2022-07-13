import { UserCompany } from '@project/common/platform/user';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class CompanyUserAddCommand extends TransportCommandAsync<ICompanyUserAddDto, ICompanyUserAddDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CompanyUserAddCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyUserAddDto) {
        super(CompanyUserAddCommand.NAME, request);
    }
}

export interface ICompanyUserAddDto {
    companyId: number;
}
export interface ICompanyUserAddDtoResponse {
    company: UserCompany;
}
