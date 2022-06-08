import { ICompanyEditDtoResponse } from '@project/common/platform/api/company';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class CompanyEditCommand extends TransportCommandAsync<number, ICompanyEditDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CompanyEditCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: number) {
        super(CompanyEditCommand.NAME, request);
    }
}
