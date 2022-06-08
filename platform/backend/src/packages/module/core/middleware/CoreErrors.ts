

import { ExtendedError } from '@ts-core/common/error';
import * as _ from 'lodash';
import { ErrorCode } from '@project/common/platform/api';
import { CoreExtendedError } from './CoreExtendedError';
import { UserRoleName, UserStatus, UserType } from '@project/common/platform/user';
import { CompanyStatus } from '@project/common/platform/company';
import { ProjectStatus } from '@project/common/platform/project';

// --------------------------------------------------------------------------
//
//  Other
//
// --------------------------------------------------------------------------

export class RequestInvalidError<T> extends CoreExtendedError<IInvalidValue<T>> {
    constructor(details: IInvalidValue<T>) {
        super(ErrorCode.INVALID_REQUEST, details, ExtendedError.HTTP_CODE_BAD_REQUEST);
    }
}

// --------------------------------------------------------------------------
//
//  User
//
// --------------------------------------------------------------------------

export class UserUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.USER_UNDEFINED, null, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}
export class UserNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.USER_NOT_FOUND);
    }
}
export class UserStatusInvalidError extends CoreExtendedError<IInvalidValue<UserStatus>> {
    constructor(details: IInvalidValue<UserStatus>) {
        super(ErrorCode.USER_STATUS_INVALID, details, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}
export class UserTypeInvalidError extends CoreExtendedError<IInvalidValue<UserType>> {
    constructor(details: IInvalidValue<UserType>) {
        super(ErrorCode.USER_TYPE_INVALID, details);
    }
}

// --------------------------------------------------------------------------
//
//  Company
//
// --------------------------------------------------------------------------

export class CompanyUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_UNDEFINED);
    }
}
export class CompanyNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_NOT_FOUND);
    }
}
export class CompanyNotUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_NOT_UNDEFINED);
    }
}
export class CompanyStatusInvalidError extends CoreExtendedError<IInvalidValue<CompanyStatus>> {
    constructor(details: IInvalidValue<CompanyStatus>) {
        super(ErrorCode.COMPANY_STATUS_INVALID, details, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}
export class CompanyRoleUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_ROLE_UNDEFINED, null, ExtendedError.HTTP_CODE_FORBIDDEN);
    }
}
export class CompanyRoleInvalidError extends CoreExtendedError<IInvalidValue<UserRoleName>> {
    constructor(details: IInvalidValue<UserRoleName>) {
        super(ErrorCode.COMPANY_ROLE_INVALID, details, ExtendedError.HTTP_CODE_FORBIDDEN);
    }
}

// --------------------------------------------------------------------------
//
//  Project
//
// --------------------------------------------------------------------------

export class ProjectUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.PROJECT_UNDEFINED);
    }
}
export class ProjectNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.PROJECT_NOT_FOUND);
    }
}
export class ProjectRoleUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.PROJECT_ROLE_UNDEFINED, null, ExtendedError.HTTP_CODE_FORBIDDEN);
    }
}
export class ProjectStatusInvalidError extends CoreExtendedError<IInvalidValue<ProjectStatus>> {
    constructor(details: IInvalidValue<ProjectStatus>) {
        super(ErrorCode.PROJECT_STATUS_INVALID, details, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}
export class ProjectRoleInvalidError extends CoreExtendedError<IInvalidValue<UserRoleName>> {
    constructor(details: IInvalidValue<UserRoleName>) {
        super(ErrorCode.PROJECT_ROLE_INVALID, details, ExtendedError.HTTP_CODE_FORBIDDEN);
    }
}

// --------------------------------------------------------------------------
//
//  User
//
// --------------------------------------------------------------------------

export class PaymentUndefinedError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.PAYMENT_UNDEFINED);
    }
}
export class PaymentNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.PAYMENT_NOT_FOUND);
    }
}
// --------------------------------------------------------------------------
//
//  Interfaces
//
// --------------------------------------------------------------------------

interface IInvalidValue<T = any> {
    name?: string;
    value: T | Array<T>;
    expected?: T | Array<T>;
}


