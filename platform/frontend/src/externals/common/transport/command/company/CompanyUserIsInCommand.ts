import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { Matches } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerCompany } from '../../../ledger/company';
import { LedgerUser } from '../../../ledger/user';

export class CompanyUserIsInCommand extends KarmaTransportCommandAsync<ICompanyUserIsInDto, ICompanyUserIsInDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_USER_IS_IN;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyUserIsInDto) {
        super(CompanyUserIsInCommand.NAME, TransformUtil.toClass(CompanyUserIsInDto, request), null, true);
    }
}

export interface ICompanyUserIsInDto extends ITraceable {
    userUid: string;
    companyUid: string;
}

class CompanyUserIsInDto implements ICompanyUserIsInDto {
    @Matches(LedgerUser.UID_REGXP)
    userUid: string;

    @Matches(LedgerCompany.UID_REGXP)
    companyUid: string;
}

export type ICompanyUserIsInDtoResponse = boolean;
