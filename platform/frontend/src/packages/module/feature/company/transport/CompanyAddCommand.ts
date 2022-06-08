import { Company } from '@project/common/platform/company';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class CompanyAddCommand extends TransportCommandAsync<void, ICompanyAddDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CompanyAddCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(CompanyAddCommand.NAME);
    }
}

export type ICompanyAddDtoResponse = Company;
