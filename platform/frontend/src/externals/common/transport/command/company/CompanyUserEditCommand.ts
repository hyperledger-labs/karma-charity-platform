import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { CompanyUserAddDto, ICompanyUserAddDto } from './CompanyUserAddCommand';

export class CompanyUserEditCommand extends KarmaTransportCommandAsync<ICompanyUserAddDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.COMPANY_USER_EDIT;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICompanyUserAddDto) {
        super(CompanyUserEditCommand.NAME, TransformUtil.toClass(CompanyUserAddDto, request));
    }
}
