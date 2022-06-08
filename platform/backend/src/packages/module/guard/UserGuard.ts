import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { DatabaseService } from '@project/module/database/service';
import { PromiseHandler } from '@ts-core/common/promise';
import { ExtendedError } from '@ts-core/common/error';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { UserRoleName, UserType } from '@project/common/platform/user';
import { IUserHolder, UserEntity, UserRoleEntity } from '@project/module/database/user';
import { CompanyRoleInvalidError, CompanyRoleUndefinedError, CompanyStatusInvalidError, CompanyUndefinedError, ProjectRoleUndefinedError, ProjectStatusInvalidError, UserTypeInvalidError } from '@project/module/core/middleware';
import { CompanyStatus } from '@project/common/platform/company';
import { CompanyEntity } from '@project/module/database/company';
import { ProjectStatus } from '@project/common/platform/project';
import { ProjectEntity } from '@project/module/database/project';
import { ProjectRoleInvalidError, ProjectUndefinedError } from '@project/module/core/middleware';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static OPTIONS: string = 'options';


    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static checkUser(options: IGuardOptions, user: UserEntity): void {
        if (!_.isEmpty(options.type) && !options.type.includes(user.type)) {
            throw new UserTypeInvalidError({ value: user.type, expected: options.type });
        }
    }
    public static checkCompany(options: IGuardOptions, company: CompanyEntity): void {
        if (!options.isCompanyRequired) {
            return;
        }
        if (options.isCompanyRequired && _.isNil(company)) {
            throw new CompanyUndefinedError();
        }
        if (!_.isEmpty(options.companyStatus) && !options.companyStatus.includes(company.status)) {
            throw new CompanyStatusInvalidError({ value: company.status, expected: options.companyStatus });
        }
        if (!_.isNil(options.companyRole)) {
            UserGuard.checkCompanyRole(options, company.userRoles);
        }
    }
    public static checkCompanyRole(options: IGuardOptions, roles: Array<UserRoleName | UserRoleEntity>): void {
        if (_.isEmpty(roles)) {
            throw new CompanyRoleUndefinedError();
        }
        if (_.isEmpty(options.companyRole)) {
            return;
        }
        let names = UserGuard.getRoleNames(roles);
        if (_.isEmpty(_.intersection(options.companyRole, names))) {
            throw new CompanyRoleInvalidError({ value: names, expected: options.companyRole });
        }
    }

    public static checkProject(options: IGuardOptions, project: ProjectEntity): void {
        if (!options.isProjectRequired) {
            return;
        }
        if (options.isProjectRequired && _.isNil(project)) {
            throw new ProjectUndefinedError();
        }
        if (!_.isEmpty(options.projectStatus) && !options.projectStatus.includes(project.status)) {
            throw new ProjectStatusInvalidError({ value: project.status, expected: options.projectStatus });
        }
        if (!_.isNil(options.projectRole)) {
            UserGuard.checkProjectRole(options, project.userRoles);
        }
    }
    public static checkProjectRole(options: IGuardOptions, roles: Array<UserRoleName | UserRoleEntity>): void {
        if (_.isEmpty(roles)) {
            throw new ProjectRoleUndefinedError();
        }
        if (_.isEmpty(options.projectRole)) {
            return;
        }
        let names = UserGuard.getRoleNames(roles);
        if (_.isEmpty(_.intersection(options.projectRole, names))) {
            throw new ProjectRoleInvalidError({ value: names, expected: options.companyRole });
        }
    }

    private static getRoleNames(items: Array<UserRoleName | UserRoleEntity>): Array<UserRoleName> {
        return items.map(item => item instanceof UserRoleEntity ? item.name : item);
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private logger: Logger, private reflector: Reflector, private database: DatabaseService) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private getOptions(options: IUserGuardOptions): IGuardOptions {
        if (_.isNil(options)) {
            return {};
        }
        let item = {} as IGuardOptions;
        if (!_.isNil(options.type)) {
            item.type = !_.isArray(options.type) ? [options.type] : options.type;
        }
        if (!_.isNil(options.company)) {
            item.isCompanyRequired = options.company.required;

            if (!_.isNil(options.company.status)) {
                options.company.status = !_.isArray(options.company.status) ? [options.company.status] : options.company.status;
                item.companyStatus = !_.isEmpty(options.company.status) ? options.company.status : null;
            }

            if (!_.isNil(options.company.role)) {
                options.company.role = !_.isArray(options.company.role) ? [options.company.role] : options.company.role;
                item.companyRole = !_.isEmpty(options.company.role) ? options.company.role : null;
            }
        }
        return item;
    }

    private async checkOptions(options: IGuardOptions, user: UserEntity): Promise<void> {
        UserGuard.checkUser(options, user);
        UserGuard.checkCompany(options, user.company);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        let isCanActivate = await PromiseHandler.toPromise(super.canActivate(context));
        if (!isCanActivate) {
            return false;
        }
        let request: IUserHolder = context.switchToHttp().getRequest();

        let user = request.user;
        let company = request.company = user.company;
        let roles = request.roles = !_.isNil(company) ? company.userRoles : null;

        let options = this.getOptions(this.reflector.get<IUserGuardOptions>(UserGuard.OPTIONS, context.getHandler()));
        await this.checkOptions(options, user);

        return true;
    }
}

export interface IGuardOptions {
    type?: Array<UserType>;
    // role?: Array<UserRoleName>;

    companyRole?: Array<UserRoleName>;
    companyStatus?: Array<CompanyStatus>;
    isCompanyRequired?: boolean;

    projectRole?: Array<UserRoleName>;
    projectStatus?: Array<ProjectStatus>;
    isProjectRequired?: boolean;
}

export interface IUserGuardOptions {
    type?: UserType | Array<UserType>;
    company?: {
        role?: UserRoleName | Array<UserRoleName>,
        status?: CompanyStatus | Array<CompanyStatus>,
        required: boolean;
    }
}

export const UserGuardOptions = (item: IUserGuardOptions) => SetMetadata(UserGuard.OPTIONS, item);
