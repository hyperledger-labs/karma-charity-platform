import { LedgerCompanyRole } from '../../ledger/role';
import { User } from '../user';

export class CompanyUser extends User {
    roles: Array<LedgerCompanyRole>;
}

