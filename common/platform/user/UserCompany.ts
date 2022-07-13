import { LedgerCompanyRole } from '../../ledger/role';
import { Company } from '../company';

export class UserCompany extends Company {
    roles: Array<LedgerCompanyRole>;
}

