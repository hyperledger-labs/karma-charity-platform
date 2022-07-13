import { UserCompany } from '@project/common/platform/user';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class CompanyToVerifyCommand extends TransportCommandAsync<void, ICompanyToVerifyDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CompanyToVerifyCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(CompanyToVerifyCommand.NAME);
    }
}

export type ICompanyToVerifyDtoResponse = UserCompany;
