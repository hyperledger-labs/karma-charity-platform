import { Company } from '@project/common/platform/company';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class CompanyRejectCommand extends TransportCommandAsync<ICompanyRejectDto, ICompanyRejectDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CompanyRejectCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyRejectDto) {
        super(CompanyRejectCommand.NAME, request);
    }
}

export type ICompanyRejectDto = Company;
export type ICompanyRejectDtoResponse = Company;
