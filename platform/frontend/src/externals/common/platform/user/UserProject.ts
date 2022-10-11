import { LedgerProjectRole } from '../../ledger/role';
import { Project } from '../project';

export class UserProject extends Project {
    roles: Array<LedgerProjectRole>;
}

