

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
export class UserLedgerNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.USER_LEDGER_NOT_FOUND);
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
export class CompanyLedgerNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.COMPANY_LEDGER_NOT_FOUND);
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
//  Login
//
// --------------------------------------------------------------------------

export class LoginIdInvalidError extends CoreExtendedError<IInvalidValue<string | number>> {
    constructor(value: string | number) {
        super(ErrorCode.LOGIN_ID_INVALID, { name: 'id', value, expected: 'NOT_NULL' }, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}

export class LoginSignatureInvalidError extends CoreExtendedError<IInvalidValue<string>> {
    constructor(name: string, value: string) {
        super(ErrorCode.LOGIN_SIGNATURE_INVALID, { name, value }, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}

export class LoginTokenInvalidError extends CoreExtendedError<string> {
    constructor(message: string) {
        super(ErrorCode.LOGIN_TOKEN_INVALID, message, ExtendedError.HTTP_CODE_UNAUTHORIZED);
    }
}

export class LoginTokenExpiredError extends CoreExtendedError<IInvalidValue<number>> {
    constructor(value: number, expected: number) {
        super(ErrorCode.LOGIN_TOKEN_EXPIRED, { name: 'token', value, expected }, ExtendedError.HTTP_CODE_UNAUTHORIZED);
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
export class ProjectLedgerNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.PROJECT_LEDGER_NOT_FOUND);
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
//  Payment
//
// --------------------------------------------------------------------------

export class PaymentNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.PAYMENT_NOT_FOUND);
    }
}

// --------------------------------------------------------------------------
//
//  Payment
//
// --------------------------------------------------------------------------

export class FileNotFoundError extends CoreExtendedError {
    constructor() {
        super(ErrorCode.FILE_NOT_FOUND);
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


