import { UserCompany } from 'common/platform/user';
import { TransportCommandAsync } from '@ts-core/common/transport';

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
