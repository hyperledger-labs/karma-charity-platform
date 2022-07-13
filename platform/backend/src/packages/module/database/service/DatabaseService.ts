import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { Connection, Repository, SelectQueryBuilder, Entity } from 'typeorm';
import { UserCryptoKeyEntity, UserEntity, UserRoleEntity } from '../user';
import * as _ from 'lodash';
import { CompanyEntity } from '../company';
import { UserUndefinedError } from '@project/module/core/middleware';
import { ProjectEntity } from '../project';
import { ProjectStatus } from '@project/common/platform/project';
import { MathUtil, ValidateUtil } from '@ts-core/common/util';
import { CompanyStatus } from '@project/common/platform/company';
import { PaymentEntity, PaymentTransactionEntity } from '../payment';
import { AccountEntity } from '../account';
import { LedgerCoinId } from '@project/common/ledger/coin';
import { PaymentAccountId } from '@project/common/platform/payment';
import { FileEntity } from '@project/module/database/file';
import { AccountType } from '@project/common/platform/account';

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

    public addUserRelations<T = any>(query: SelectQueryBuilder<T>): void {
        query.leftJoinAndSelect('user.company', 'company');
        query.leftJoinAndSelect('user.cryptoKey', 'userCryptoKey');
        query.leftJoinAndSelect('user.preferences', 'userPreferences');
    }

    public addCompanyRelations<T = any>(query: SelectQueryBuilder<T>, userId?: number | string | UserEntity): void {
        query.leftJoinAndSelect('company.accounts', 'companyAccounts');
        query.leftJoinAndSelect('company.preferences', 'companyPreferences');
        query.leftJoinAndSelect('company.paymentAggregator', 'companyPaymentAggregator')
        if (userId instanceof UserEntity) {
            userId = userId.id;
        }
        if (!_.isNil(userId)) {
            query.leftJoinAndMapMany('company.userRoles', UserRoleEntity, 'companyRole', `companyRole.userId = ${userId} AND companyRole.companyId = company.id`)
        }
    }

    public addProjectRelations<T = any>(query: SelectQueryBuilder<T>, userId?: number | UserEntity): void {
        query.leftJoinAndSelect('project.accounts', 'projectAccounts');
        query.leftJoinAndSelect('project.purposes', 'projectPurposes');
        query.leftJoinAndSelect('project.preferences', 'projectPreferences');

        if (userId instanceof UserEntity) {
            userId = userId.id;
        }
        if (!_.isNil(userId)) {
            query.leftJoinAndMapMany('project.userRoles', UserRoleEntity, 'projectRole', `projectRole.userId = ${userId} AND projectRole.projectId = project.id`)
        }
    }

    public addPaymentRelations<T = any>(query: SelectQueryBuilder<T>): void {
        query.leftJoinAndSelect('payment.user', 'user');
        this.addUserRelations(query);
    }

    public addPaymentTransactionRelations<T = any>(query: SelectQueryBuilder<T>): void {
        query.leftJoinAndMapOne('paymentTransaction.project', ProjectEntity, 'project', `paymentTransaction.projectId = project.id`);
        query.leftJoinAndMapOne('paymentTransaction.company', CompanyEntity, 'company', `paymentTransaction.companyId = company.id`);
        this.addCompanyRelations(query);
        this.addProjectRelations(query);
    }

    // --------------------------------------------------------------------------
    //
    //  User Methods
    //
    // --------------------------------------------------------------------------

    public async userGet(idOrUidLogin: string | number): Promise<UserEntity> {
        let query = this.user.createQueryBuilder('user');
        if (_.isString(idOrUidLogin)) {
            if (idOrUidLogin.indexOf('@') === 0) {
                query.where(`user.uid  = :uid`, { uid: idOrUidLogin });
            }
            else {
                query.where(`user.login  = :login`, { login: idOrUidLogin });
            }
        }
        else if (_.isNumber(idOrUidLogin)) {
            query.where(`user.id  = :id`, { id: idOrUidLogin });
        }
        else {
            throw new UserUndefinedError();
        }

        this.addUserRelations(query);
        this.addCompanyRelations(query, 'user.id');
        return query.getOne();
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
        return this.company.save(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Project Methods
    //
    // --------------------------------------------------------------------------

    public async projectGet(id: number, userId?: number | UserEntity, isNeedCompany?: boolean): Promise<ProjectEntity> {
        let query = this.project.createQueryBuilder('project');
        query.where(`project.id  = :id`, { id });
        this.addProjectRelations(query, userId);
        // this.addCompanyRelations(query, userId);

        return query.getOne();
    }

    public async projectStatus(item: ProjectEntity, status: ProjectStatus): Promise<ProjectEntity> {
        item.status = status;
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
        this.addPaymentRelations(query);
        return query.getOne();
    }

    public async paymentGetByReference(referenceId: string): Promise<PaymentEntity> {
        let query = this.payment.createQueryBuilder('payment');
        query.where(`payment.referenceId  = :referenceId`, { referenceId });
        query.leftJoinAndSelect('payment.transactions', 'transactions');
        this.addPaymentRelations(query);
        
        return query.getOne();
    }

    // --------------------------------------------------------------------------
    //
    //  Payment Transaction Methods
    //
    // --------------------------------------------------------------------------

    public async getCollectedAmount(coinId: LedgerCoinId, companyId: number = null, projectId: number = null): Promise<string> {
        let query = this.paymentTransaction.createQueryBuilder('transaction')
            .select('transaction.coinId', 'coinId')
            .addSelect('SUM(transaction.amount)', 'amount')
            .where(`transaction.coinId = :coinId`, { coinId })
            .andWhere(`transaction.debet = :debet`, { debet: PaymentAccountId.AC00 })

        if (!_.isNil(companyId)) {
            query.andWhere(`transaction.companyId = :companyId`, { companyId })
        }
        if (!_.isNil(projectId)) {
            query.andWhere(`transaction.projectId = :projectId`, { projectId })
        }

        query.groupBy('transaction.coinId');

        let item = await query.getRawOne();
        return !_.isNil(item) ? item['amount'] : '0';
    }

    public async isAmountCollected(projectId: number): Promise<boolean> {
        let requiredAccounts = await this.account.find({ type: AccountType.REQUIRED, projectId });
        let collectedAccounts = await this.account.find({ type: AccountType.COLLECTED, projectId });

        for (let required of requiredAccounts) {
            let collected = _.find(collectedAccounts, { coinId: required.coinId });
            if (_.isNil(collected) || MathUtil.lessThan(collected.amount, required.amount)) {
                return false;
            }
        }
        return true;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public getConnection(): Connection {
        return this.connection;
    }

    public get file(): Repository<FileEntity> {
        return this.connection.getRepository(FileEntity);
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

    public get account(): Repository<AccountEntity> {
        return this.connection.getRepository(AccountEntity);
    }

    public get paymentTransaction(): Repository<PaymentTransactionEntity> {
        return this.connection.getRepository(PaymentTransactionEntity);
    }

}
