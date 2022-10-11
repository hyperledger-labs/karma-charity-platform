import { UserCompany } from '@project/common/platform/user';
import { TransportCommandAsync } from '@ts-core/common';

export class CompanyActivateCommand extends TransportCommandAsync<void, ICompanyActivateDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CompanyActivateCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(CompanyActivateCommand.NAME);
    }
}

export type ICompanyActivateDtoResponse = UserCompany;
