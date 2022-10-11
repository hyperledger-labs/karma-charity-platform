import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerUser } from '../../../ledger/user';
import { ITraceable } from '@ts-core/common';
import { Matches } from 'class-validator';
import { LedgerCompany } from '../../../ledger/company';
import { LedgerCompanyRole } from '../../../ledger/role';

export class CompanyUserRoleListCommand extends KarmaTransportCommandAsync<ICompanyUserRoleListDto, ICompanyUserRoleListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_USER_ROLE_LIST;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyUserRoleListDto) {
        super(CompanyUserRoleListCommand.NAME, TransformUtil.toClass(CompanyUserRoleListDto, request), null, true);
    }
}

export interface ICompanyUserRoleListDto extends ITraceable {
    userUid: string;
    companyUid: string;
}

export type ICompanyUserRoleListDtoResponse = Array<LedgerCompanyRole>;

class CompanyUserRoleListDto implements ICompanyUserRoleListDto {
    @Matches(LedgerUser.UID_REGXP)
    userUid: string;

    @Matches(LedgerCompany.UID_REGXP)
    companyUid: string;
}
