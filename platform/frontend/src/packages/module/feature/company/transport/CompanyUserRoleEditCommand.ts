import { UserCompany } from '@project/common/platform/user';
import { TransportCommandAsync } from '@ts-core/common';

export class CompanyUserRoleEditCommand extends TransportCommandAsync<ICompanyUserRoleEditDto, ICompanyUserRoleEditDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CompanyUserRoleEditCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyUserRoleEditDto) {
        super(CompanyUserRoleEditCommand.NAME, request);
    }
}

export interface ICompanyUserRoleEditDto {
    userId: number;
    companyId: number;
}
export interface ICompanyUserRoleEditDtoResponse {
    company: UserCompany;
}
