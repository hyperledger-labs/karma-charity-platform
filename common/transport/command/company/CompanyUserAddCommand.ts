import { ITraceable } from '@ts-core/common/trace';
import { TransformUtil } from '@ts-core/common/util';
import { Matches, IsOptional, IsEnum } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerCompany } from '../../../ledger/company';
import { LedgerUser } from '../../../ledger/user';
import { LedgerRole, LedgerCompanyRole } from '../../../ledger/role';

export class CompanyUserAddCommand extends KarmaTransportCommandAsync<ICompanyUserAddDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_USER_ADD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyUserAddDto) {
        super(CompanyUserAddCommand.NAME, TransformUtil.toClass(CompanyUserAddDto, request));
    }
}

export interface ICompanyUserAddDto extends ITraceable {
    userUid: string;
    companyUid: string;
    roles?: Array<LedgerCompanyRole>;
}

// export needs because another command use it
export class CompanyUserAddDto implements ICompanyUserAddDto {
    @Matches(LedgerUser.UID_REGXP)
    userUid: string;

    @Matches(LedgerCompany.UID_REGXP)
    companyUid: string;

    @IsOptional()
    @IsEnum(LedgerCompanyRole, { each: true })
    roles?: Array<LedgerCompanyRole>;
}
