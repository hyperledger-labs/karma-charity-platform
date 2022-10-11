
import * as _ from 'lodash';
import { LedgerCompanyRole } from '../../ledger/role';
import { PermissionUtil } from '../../util';
import { UserCompany, UserType } from '../user';
import { CompanyStatus } from './CompanyStatus';

export class CompanyUtil {

    // --------------------------------------------------------------------------
    //
    //  Company Methods
    //
    // --------------------------------------------------------------------------

    public static isCanEdit(item: UserCompany): boolean {
        return COMPANY_EDIT_STATUS.includes(item.status) && PermissionUtil.isHasRole(item.roles, COMPANY_EDIT_ROLE);
    }
    public static isCanReject(item: UserCompany): boolean {
        return COMPANY_REJECT_STATUS.includes(item.status);
    }
    public static isCanVerify(item: UserCompany): boolean {
        return COMPANY_VERIFY_STATUS.includes(item.status);
    }
    public static isCanToVerify(item: UserCompany): boolean {
        return COMPANY_TO_VERIFY_STATUS.includes(item.status) && PermissionUtil.isHasRole(item.roles, COMPANY_TO_VERIFY_ROLE);
    }
    public static isCanActivate(item: UserCompany): boolean {
        return COMPANY_ACTIVATE_STATUS.includes(item.status) && PermissionUtil.isHasRole(item.roles, COMPANY_ACTIVATE_ROLE);
    }
    public static isCanProjectAdd(item: UserCompany): boolean {
        return COMPANY_PROJECT_ADD_STATUS.includes(item.status) && PermissionUtil.isHasRole(item.roles, COMPANY_PROJECT_ADD_ROLE);
    }
    public static isCanUserRoleSet(item: UserCompany): boolean {
        return PermissionUtil.isHasRole(item.roles, COMPANY_USER_ROLE_SET_ROLE);
    }
}

export let COMPANY_ADD_TYPE = [UserType.COMPANY_MANAGER];

export let COMPANY_PROJECT_ADD_ROLE = [LedgerCompanyRole.PROJECT_MANAGER];
export let COMPANY_PROJECT_ADD_STATUS = [CompanyStatus.ACTIVE];

export let COMPANY_EDIT_ROLE = [LedgerCompanyRole.COMPANY_MANAGER];
export let COMPANY_EDIT_STATUS = [CompanyStatus.DRAFT, CompanyStatus.REJECTED];

export let COMPANY_ACTIVATE_TYPE = [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER];
export let COMPANY_ACTIVATE_ROLE = [LedgerCompanyRole.COMPANY_MANAGER];
export let COMPANY_ACTIVATE_STATUS = [CompanyStatus.VERIFIED];

export let COMPANY_REJECT_TYPE = [UserType.EDITOR, UserType.ADMINISTRATOR];
export let COMPANY_REJECT_STATUS = [CompanyStatus.VERIFICATION_PROCESS];

export let COMPANY_VERIFY_TYPE = [UserType.EDITOR, UserType.ADMINISTRATOR];
export let COMPANY_VERIFY_STATUS = [CompanyStatus.VERIFICATION_PROCESS];

export let COMPANY_TO_VERIFY_TYPE = [UserType.COMPANY_MANAGER];
export let COMPANY_TO_VERIFY_ROLE = [LedgerCompanyRole.COMPANY_MANAGER];
export let COMPANY_TO_VERIFY_STATUS = [CompanyStatus.DRAFT, CompanyStatus.REJECTED];

export let COMPANY_USER_LIST_ROLE = [LedgerCompanyRole.COMPANY_MANAGER, LedgerCompanyRole.USER_MANAGER, LedgerCompanyRole.COIN_MANAGER, LedgerCompanyRole.PROJECT_MANAGER];

// export let COMPANY_USER_ROLE_SET_TYPE = [UserType.ADMINISTRATOR, UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER];
export let COMPANY_USER_ROLE_GET_ROLE = [LedgerCompanyRole.USER_MANAGER, LedgerCompanyRole.COMPANY_MANAGER];
export let COMPANY_USER_ROLE_SET_ROLE = [LedgerCompanyRole.USER_MANAGER, LedgerCompanyRole.COMPANY_MANAGER];

