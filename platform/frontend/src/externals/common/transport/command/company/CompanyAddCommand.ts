import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { Matches, Length } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerCompany } from '../../../ledger/company';
import { RegExpUtil, ValidateUtil } from '../../../util';
import { LedgerUser } from '../../../ledger/user';

export class CompanyAddCommand extends KarmaTransportCommandAsync<ICompanyAddDto, LedgerCompany> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_ADD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyAddDto) {
        super(CompanyAddCommand.NAME, TransformUtil.toClass(CompanyAddDto, request));
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

export interface ICompanyAddDto extends ITraceable {
    ownerUid: string;
    description: string;
}

export class CompanyAddDto implements ICompanyAddDto {
    @Matches(LedgerUser.UID_REGXP)
    ownerUid: string;

    @Length(ValidateUtil.DESCRIPTION_MIN_LENGTH, ValidateUtil.DESCRIPTION_MAX_LENGTH)
    @Matches(RegExpUtil.DESCRIPTION)
    description: string;
}
