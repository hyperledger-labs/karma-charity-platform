import { LedgerCompanyRole, LedgerProjectRole } from "../ledger/role";
import * as _ from 'lodash';
import { UserCompany, UserRole, UserRoleName, UserType } from "../platform/user";
import { CompanyStatus } from "../platform/company";

export class PermissionUtil {
    // --------------------------------------------------------------------------
    //
    //  Common Methods
    //
    // --------------------------------------------------------------------------

    public static isHasRole(item: UserRoleName | Array<UserRoleName>, items: UserRoleName | Array<UserRoleName>): boolean {
        if (!_.isArray(item)) {
            item = [item];
        }
        if (!_.isArray(items)) {
            items = [items];
        }
        return !_.isEmpty(_.intersection(item, items));
    }

    // --------------------------------------------------------------------------
    //
    //  Project Methods
    //
    // --------------------------------------------------------------------------

    public static isCanProjectEdit(roles: Array<LedgerProjectRole>): boolean {
        if (_.isEmpty(roles)) {
            return false;
        }
        return !_.isEmpty(_.intersection(roles, [LedgerProjectRole.PROJECT_MANAGER]));
    }

    public static isCanProjectUserEdit(roles: Array<LedgerProjectRole>): boolean {
        if (_.isEmpty(roles)) {
            return false;
        }
        return !_.isEmpty(_.intersection(roles, [LedgerProjectRole.USER_MANAGER, LedgerProjectRole.PROJECT_MANAGER]));
    }

    public static isCanProjectFileRemove(roles: Array<UserRoleName>): boolean {
        if (_.isEmpty(roles)) {
            return false;
        }
        return !_.isEmpty(_.intersection(roles, [LedgerProjectRole.PROJECT_MANAGER, LedgerProjectRole.COIN_MANAGER, LedgerProjectRole.COIN_MANAGER]));
    }
}