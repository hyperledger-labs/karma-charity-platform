import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { LedgerCompany } from '../../../ledger/company';
import { Matches } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';

export class CompanyRemoveCommand extends KarmaTransportCommandAsync<ICompanyRemoveDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_REMOVE;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyRemoveDto) {
        super(CompanyRemoveCommand.NAME, TransformUtil.toClass(CompanyRemoveDto, request));
    }
}

export interface ICompanyRemoveDto extends ITraceable {
    uid: string;
}

class CompanyRemoveDto implements ICompanyRemoveDto {
    @Matches(LedgerCompany.UID_REGXP)
    uid: string;
}
