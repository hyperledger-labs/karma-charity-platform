import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { IsOptional, Matches, IsArray } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerCompany } from '../../../ledger/company';

export class CompanyGetCommand extends KarmaTransportCommandAsync<ICompanyGetDto, LedgerCompany> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyGetDto) {
        super(CompanyGetCommand.NAME, TransformUtil.toClass(CompanyGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: LedgerCompany): LedgerCompany {
        return TransformUtil.toClass(LedgerCompany, item);
    }
}

export interface ICompanyGetDto extends ITraceable {
    uid: string;
    details?: Array<keyof LedgerCompany>;
}

class CompanyGetDto implements ICompanyGetDto {
    @Matches(LedgerCompany.UID_REGXP)
    uid: string;

    @IsArray()
    @IsOptional()
    details?: Array<keyof LedgerCompany>;
}
