import { Type } from 'class-transformer';
import { LedgerCompanyRole, LedgerProjectRole, LedgerRole } from '../../ledger/role';

export class UserRole {
    id: number;
    name: UserRoleName;
    userId: number;
    companyId?: number;
    projectId?: number;

    @Type(() => Date)
    createdDate: Date;
    @Type(() => Date)
    updatedDate: Date;
}

export type UserRoleName = LedgerCompanyRole | LedgerProjectRole | LedgerRole;
