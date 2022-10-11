import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { LedgerCompany } from '../../../ledger/company';
import { Length, IsOptional, Matches } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { RegExpUtil, ValidateUtil } from '../../../util';

export class CompanyEditCommand extends KarmaTransportCommandAsync<ICompanyEditDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_EDIT;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyEditDto) {
        super(CompanyEditCommand.NAME, TransformUtil.toClass(CompanyEditDto, request));
    }
}

export interface ICompanyEditDto extends ITraceable {
    uid: string;
    description?: string;
}

class CompanyEditDto implements ICompanyEditDto {
    @Matches(LedgerCompany.UID_REGXP)
    uid: string;

    @IsOptional()
    @Length(ValidateUtil.DESCRIPTION_MIN_LENGTH, ValidateUtil.DESCRIPTION_MAX_LENGTH)
    @Matches(RegExpUtil.DESCRIPTION)
    description?: string;
}
