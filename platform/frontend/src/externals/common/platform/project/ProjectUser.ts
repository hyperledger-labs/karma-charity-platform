import { LedgerProjectRole } from '../../ledger/role';
import { User } from '../user';

export class ProjectUser extends User {
    roles: Array<LedgerProjectRole>;
}

