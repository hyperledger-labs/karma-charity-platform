
import * as _ from 'lodash';
import { LedgerCompanyRole, LedgerProjectRole } from '../../ledger/role';
import { PermissionUtil } from '../../util';
import { UserCompany, UserProject, UserType } from '../user';
import { ProjectStatus } from './ProjectStatus';

export class ProjectUtil {

    // --------------------------------------------------------------------------
    //
    //  Company Methods
    //
    // --------------------------------------------------------------------------

    public static isCanEdit(item: UserProject): boolean {
        return PROJECT_EDIT_STATUS.includes(item.status) && PermissionUtil.isHasRole(item.roles, PROJECT_EDIT_ROLE);
    }
    public static isCanReject(item: UserProject): boolean {
        return PROJECT_REJECT_STATUS.includes(item.status);
    }
    public static isCanVerify(item: UserProject): boolean {
        return PROJECT_VERIFY_STATUS.includes(item.status);
    }
    public static isCanActivate(item: UserProject): boolean {
        return PROJECT_ACTIVATE_STATUS.includes(item.status) && PermissionUtil.isHasRole(item.roles, PROJECT_ACTIVATE_ROLE);
    }
    public static isCanToVerify(item: UserProject): boolean {
        return PROJECT_TO_VERIFY_STATUS.includes(item.status) && PermissionUtil.isHasRole(item.roles, PROJECT_TO_VERIFY_ROLE);
    }
    public static isCanReportSubmit(item: UserProject): boolean {
        return PROJECT_REPORT_SUBMIT_STATUS.includes(item.status) && PermissionUtil.isHasRole(item.roles, PROJECT_REPORT_SUBMIT_ROLE);
    }
}

export let PROJECT_ADD_TYPE = [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER];
export let PROJECT_ADD_ROLE = [LedgerCompanyRole.PROJECT_MANAGER];

export let PROJECT_EDIT_ROLE = [LedgerProjectRole.PROJECT_MANAGER];
export let PROJECT_EDIT_STATUS = [ProjectStatus.DRAFT, ProjectStatus.REJECTED];

export let PROJECT_ACTIVATE_TYPE = [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER];
export let PROJECT_ACTIVATE_ROLE = [LedgerProjectRole.PROJECT_MANAGER];
export let PROJECT_ACTIVATE_STATUS = [ProjectStatus.VERIFIED];

export let PROJECT_REJECT_TYPE = [UserType.EDITOR, UserType.ADMINISTRATOR];
export let PROJECT_REJECT_STATUS = [ProjectStatus.VERIFICATION_PROCESS];

export let PROJECT_VERIFY_TYPE = [UserType.EDITOR, UserType.ADMINISTRATOR];
export let PROJECT_VERIFY_STATUS = [ProjectStatus.VERIFICATION_PROCESS];

export let PROJECT_TO_VERIFY_TYPE = [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER];
export let PROJECT_TO_VERIFY_ROLE = [LedgerProjectRole.PROJECT_MANAGER];
export let PROJECT_TO_VERIFY_STATUS = [ProjectStatus.DRAFT, ProjectStatus.REJECTED];

export let PROJECT_USER_LIST_ROLE = [LedgerProjectRole.PROJECT_MANAGER, LedgerProjectRole.USER_MANAGER, LedgerProjectRole.COIN_MANAGER];

export let PROJECT_USER_ROLE_SET_TYPE = [UserType.ADMINISTRATOR, UserType.COMPANY_WORKER, UserType.COMPANY_MANAGER];
export let PROJECT_USER_ROLE_GET_ROLE = [LedgerProjectRole.PROJECT_MANAGER, LedgerProjectRole.USER_MANAGER];
export let PROJECT_USER_ROLE_SET_ROLE = [LedgerProjectRole.PROJECT_MANAGER, LedgerProjectRole.USER_MANAGER];

export let PROJECT_REPORT_SUBMIT_TYPE = [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER];
export let PROJECT_REPORT_SUBMIT_ROLE = [LedgerProjectRole.PROJECT_MANAGER];
export let PROJECT_REPORT_SUBMIT_STATUS = [ProjectStatus.COLLECTED];





