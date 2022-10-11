import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { Matches } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerCompany } from '../../../ledger/company';
import { LedgerUser } from '../../../ledger/user';

export class CompanyUserRemoveCommand extends KarmaTransportCommandAsync<ICompanyUserRemoveDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_USER_REMOVE;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyUserRemoveDto) {
        super(CompanyUserRemoveCommand.NAME, TransformUtil.toClass(CompanyUserRemoveDto, request));
    }
}

export interface ICompanyUserRemoveDto extends ITraceable {
    userUid: string;
    companyUid: string;
}

class CompanyUserRemoveDto implements ICompanyUserRemoveDto {
    @Matches(LedgerUser.UID_REGXP)
    userUid: string;

    @Matches(LedgerCompany.UID_REGXP)
    companyUid: string;
}
