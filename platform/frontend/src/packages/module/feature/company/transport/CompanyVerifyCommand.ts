import { Company } from '@project/common/platform/company';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class CompanyVerifyCommand extends TransportCommandAsync<ICompanyVerifyDto, ICompanyVerifyDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CompanyVerifyCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyVerifyDto) {
        super(CompanyVerifyCommand.NAME, request);
    }
}

export type ICompanyVerifyDto = Company;
export type ICompanyVerifyDtoResponse = Company;
