import * as _ from 'lodash';
import { LedgerRole, LedgerCompanyRole, LedgerProjectRole } from '@project/common/ledger/role';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { PromiseReflector } from '@ts-core/common/promise';
import { IUserStubHolder } from './IUserStubHolder';
import { LedgerUser } from '@project/common/ledger/user';
import { UID } from '@ts-core/common/dto';

// --------------------------------------------------------------------------
//
//  Public Methods
//
// --------------------------------------------------------------------------

export async function rolesSomeOf(...items: Array<Promise<PromiseReflector<void, LedgerError>>>): Promise<void> {
    if (_.isEmpty(items)) {
        return;
    }
    let result = await Promise.all(items);
    if (result.every(item => item.isError)) {
        throw result[0].error;
    }
}

export async function rolesCheck(holder: IUserStubHolder, ...roles: Array<LedgerRole>): Promise<void> {
    return check(holder.user, await holder.db.user.roleList(holder.user), roles);
}

export async function rolesCompanyCheck(holder: IUserStubHolder, company: UID, ...roles: Array<LedgerCompanyRole>): Promise<void> {
    return check(holder.user, await holder.db.company.userRoleList(company, holder.user), roles);
}

export async function rolesProjectCheck(holder: IUserStubHolder, project: UID, ...roles: Array<LedgerProjectRole>): Promise<void> {
    return check(holder.user, await holder.db.project.userRoleList(project, holder.user), roles);
}

// --------------------------------------------------------------------------
//
//  Private Methods
//
// --------------------------------------------------------------------------

async function check<T = string>(user: LedgerUser, exists: Array<T>, required: Array<T>): Promise<void> {
    let items = lack(exists, required);
    if (!_.isEmpty(items)) {
        throw new LedgerError(LedgerErrorCode.FORBIDDEN, `User "${user.uid}" doesn't have "${items.join(',')}" role`);
    }
}

function lack<T = string>(exists: Array<T>, required: Array<T>): Array<T> {
    return _.difference(_.uniq(_.compact(required)), _.uniq(_.compact(exists)));
}
