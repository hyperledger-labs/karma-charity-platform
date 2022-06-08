import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { Connection, Repository, SelectQueryBuilder, Entity } from 'typeorm';
import { IUserHolder, UserCryptoKeyEntity, UserEntity, UserRoleEntity } from '../user';
import * as _ from 'lodash';
import { CompanyEntity } from '../company';
import { UserUndefinedError } from '@project/module/core/middleware';
import { ProjectEntity } from '../project';
import { ProjectStatus } from '@project/common/platform/project';
import { ValidateUtil } from '@ts-core/common/util';
import { CompanyStatus } from '@project/common/platform/company';
import { PaymentEntity } from '../payment';

@Injectable()
export class DatabaseService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private connection: Connection) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Query Methods
    //
    // --------------------------------------------------------------------------

    private addUserRelations<T = any>(query: SelectQueryBuilder<T>): void {
        query.innerJoinAndSelect('user.cryptoKey', 'cryptoKey');
        query.innerJoinAndSelect('user.preferences', 'preferences');
        query.leftJoinAndSelect('user.company', 'company');
    }

    private addCompanyRelations<T = any>(query: SelectQueryBuilder<T>, userId?: number | string | UserEntity): void {
        query.leftJoinAndSelect('company.preferences', 'companyPreferences');
        query.leftJoinAndSelect('company.paymentAggregator', 'companyPaymentAggregator')
        if (userId instanceof UserEntity) {
            userId = userId.id;
        }
        if (!_.isNil(userId)) {
            query.leftJoinAndMapMany("company.userRoles", UserRoleEntity, 'companyRole', `companyRole.userId = ${userId} and companyRole.companyId = company.id`)
        }
    }

    private addProjectRelations<T = any>(query: SelectQueryBuilder<T>, userId?: number | UserEntity): void {
        query.innerJoinAndSelect('project.preferences', 'preferences');
        query.innerJoinAndSelect('project.company', 'company');

        if (userId instanceof UserEntity) {
            userId = userId.id;
        }
        if (!_.isNil(userId)) {
            query.leftJoinAndMapMany("project.userRoles", UserRoleEntity, 'projectRole', `projectRole.userId = ${userId} and projectRole.projectId = project.id`)
        }
    }

    // --------------------------------------------------------------------------
    //
    //  User Methods
    //
    // --------------------------------------------------------------------------

    public async userGet(idOrLogin: string | number): Promise<UserEntity> {
        let query = this.user.createQueryBuilder('user');
        if (_.isString(idOrLogin)) {
            query.where(`user.login  = :login`, { login: idOrLogin });
        }
        else if (_.isNumber(idOrLogin)) {
            query.where(`user.id  = :id`, { id: idOrLogin });
        }
        else {
            throw new UserUndefinedError();
        }

        this.addUserRelations(query);
        this.addCompanyRelations(query, 'user.id');
        return query.getOne();
    }

    public async userSave(item: UserEntity): Promise<UserEntity> {
        await ValidateUtil.validate(item);
        return this.user.save(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Company Methods
    //
    // --------------------------------------------------------------------------

    public async companyGet(id: number, userId?: number | UserEntity): Promise<CompanyEntity> {
        let query = this.company.createQueryBuilder('company');
        query.where(`company.id  = :id`, { id });
        this.addCompanyRelations(query, userId);
        return query.getOne();
    }

    public async companyStatus(item: CompanyEntity, status: CompanyStatus): Promise<CompanyEntity> {
        item.status = status;
        return this.companySave(item);
    }

    public async companySave(item: CompanyEntity): Promise<CompanyEntity> {
        await ValidateUtil.validate(item);
        return this.company.save(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Project Methods
    //
    // --------------------------------------------------------------------------

    public async projectGet(id: number, userId?: number | UserEntity): Promise<ProjectEntity> {
        let query = this.project.createQueryBuilder('project');
        query.where(`project.id  = :id`, { id });
        this.addProjectRelations(query, userId);
        this.addCompanyRelations(query, userId);
        return query.getOne();
    }

    public async projectStatus(item: ProjectEntity, status: ProjectStatus): Promise<ProjectEntity> {
        item.status = status;
        return this.projectSave(item);
    }

    public async projectSave(item: ProjectEntity): Promise<ProjectEntity> {
        await ValidateUtil.validate(item);
        return this.project.save(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Payment Methods
    //
    // --------------------------------------------------------------------------

    public async paymentGet(id: number): Promise<PaymentEntity> {
        let query = this.payment.createQueryBuilder('payment');
        query.where(`payment.id  = :id`, { id });
        // this.addPaymentRelations(query, userId);
        return query.getOne();
    }

    public async paymentSave(item: PaymentEntity): Promise<PaymentEntity> {
        await ValidateUtil.validate(item);
        return this.payment.save(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public getConnection(): Connection {
        return this.connection;
    }

    public get user(): Repository<UserEntity> {
        return this.connection.getRepository(UserEntity);
    }

    public get userRole(): Repository<UserRoleEntity> {
        return this.connection.getRepository(UserRoleEntity);
    }

    public get userCryptoKey(): Repository<UserCryptoKeyEntity> {
        return this.connection.getRepository(UserCryptoKeyEntity);
    }

    public get company(): Repository<CompanyEntity> {
        return this.connection.getRepository(CompanyEntity);
    }

    public get project(): Repository<ProjectEntity> {
        return this.connection.getRepository(ProjectEntity);
    }

    public get payment(): Repository<PaymentEntity> {
        return this.connection.getRepository(PaymentEntity);
    }

}
