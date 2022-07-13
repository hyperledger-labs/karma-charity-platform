import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { UserEntity, UserRoleEntity } from '@project/module/database/user';
import { LoginService, UserService } from '@project/module/login/service';
import { LoginResource } from '@project/common/platform/api/login';
import { LedgerApiClient } from '@project/module/core/service';
import { LedgerUser } from '@project/common/ledger/user';
import { UserAddCommand, UserGetCommand } from '@project/common/transport/command/user';
import { CompanyEntity, CompanyPreferencesEntity } from '@project/module/database/company';
import { CompanyStatus, CompanyType } from '@project/common/platform/company';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { CompanyAddCommand, CompanyUserIsInCommand, CompanyUserAddCommand, CompanyUserRemoveCommand, CompanyUserRoleListCommand, CompanyUserEditCommand } from '@project/common/transport/command/company';
import { CompanyPaymentAggregatorEntity } from '@project/module/database/company/CompanyPaymentAggregatorEntity';
import { LedgerCompanyRole, LedgerProjectRole } from '@project/common/ledger/role';
import { RandomUtil, ValidateUtil } from '@ts-core/common/util';
import { ExtendedError } from '@ts-core/common/error';
import { UserGuard } from '@project/module/guard';
import { ProjectEntity } from '@project/module/database/project';
import { ProjectAddCommand, ProjectUserAddCommand, ProjectUserEditCommand, ProjectUserIsInCommand, ProjectUserRemoveCommand } from '@project/common/transport/command/project';
import { PROJECT_ACTIVATE_ROLE, PROJECT_ACTIVATE_STATUS } from '@project/common/platform/project';
import { PaymentEntity, PaymentTransactionEntity } from '@project/module/database/payment';
import { CoinEmitCommand, CoinObjectType, ICoinEmitDto } from '@project/common/transport/command/coin';
import { Transport } from '@ts-core/common/transport';
import { CryptoKeyType } from '@project/common/platform/crypto';
import { Ed25519 } from '@ts-core/common/crypto';
import { CryptoEncryptCommand } from '@project/module/crypto/transport';

@Injectable()
export class LedgerService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static USER_ROOT_LOGIN = LoginService.createLogin('111452810894131754642', LoginResource.GOOGLE);
    public static USER_ROOT_LEDGER_UID = LedgerUser.createRoot().uid;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService, private api: LedgerApiClient) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Project Methods
    //
    // --------------------------------------------------------------------------

    public async projectAdd(ownerUid: string, project: ProjectEntity, company: CompanyEntity): Promise<ProjectEntity> {
        if (!_.isNil(project.ledgerUid)) {
            return project;
        }

        this.api.setSigner({ uid: ownerUid });
        let item = await this.api.ledgerRequestSendListen(new ProjectAddCommand({
            ownerUid,
            companyUid: company.ledgerUid,
            description: project.preferences.title,
            purposes: project.purposes.map(item => { return { name: item.name, amount: item.amount, decimals: 2, coinId: item.coinId, } })
        }));
        project.ledgerUid = item.uid;
        return project;
    }

    public async projectUserRoleSet(owner: UserEntity, project: ProjectEntity, user: UserEntity, roles: Array<LedgerProjectRole>): Promise<void> {
        UserGuard.checkUser({ isRequired: true, isLedgerRequired: true }, owner);
        UserGuard.checkUser({ isRequired: true, isLedgerRequired: true }, user);
        UserGuard.checkProject({ isProjectRequired: true, isProjectLedgerRequired: true }, project);

        this.api.setSigner({ uid: owner.ledgerUid, isKeepAfterSigning: true });

        let isInProject = await this.api.ledgerRequestSendListen(new ProjectUserIsInCommand({ projectUid: project.ledgerUid, userUid: user.ledgerUid }));
        let isHasRoles = !_.isEmpty(roles);

        if (isInProject) {
            if (isHasRoles) {
                await this.api.ledgerRequestSendListen(new ProjectUserEditCommand({ projectUid: project.ledgerUid, userUid: user.ledgerUid, roles }));
            }
            else {
                await this.api.ledgerRequestSendListen(new ProjectUserRemoveCommand({ projectUid: project.ledgerUid, userUid: user.ledgerUid }));
            }
        }
        else {
            if (isHasRoles) {
                await this.api.ledgerRequestSendListen(new ProjectUserAddCommand({ projectUid: project.ledgerUid, userUid: user.ledgerUid }));
            }
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Company Methods
    //
    // --------------------------------------------------------------------------

    public async companyUserRoleSet(owner: UserEntity, company: CompanyEntity, user: UserEntity, roles: Array<LedgerCompanyRole>): Promise<void> {
        UserGuard.checkUser({ isRequired: true, isLedgerRequired: true }, owner);
        UserGuard.checkUser({ isRequired: true, isLedgerRequired: true }, user);
        UserGuard.checkCompany({ isCompanyRequired: true, isCompanyLedgerRequired: true }, company);

        this.api.setSigner({ uid: owner.ledgerUid, isKeepAfterSigning: true });

        let isInCompany = await this.api.ledgerRequestSendListen(new CompanyUserIsInCommand({ companyUid: company.ledgerUid, userUid: user.ledgerUid }));
        let isHasRoles = !_.isEmpty(roles);

        if (isInCompany) {
            if (isHasRoles) {
                await this.api.ledgerRequestSendListen(new CompanyUserEditCommand({ companyUid: company.ledgerUid, userUid: user.ledgerUid, roles }));
            }
            else {
                await this.api.ledgerRequestSendListen(new CompanyUserRemoveCommand({ companyUid: company.ledgerUid, userUid: user.ledgerUid }));
            }
        }
        else {
            if (isHasRoles) {
                await this.api.ledgerRequestSendListen(new CompanyUserAddCommand({ companyUid: company.ledgerUid, userUid: user.ledgerUid }));
            }
        }
        this.api.setSigner(null);
    }

    public async companyAdd(ownerUid: string, company: CompanyEntity): Promise<CompanyEntity> {
        if (!_.isNil(company.ledgerUid)) {
            return company;
        }

        this.api.setSigner({ uid: LedgerService.USER_ROOT_LEDGER_UID, isDisableDecryption: true });
        let item = await this.api.ledgerRequestSendListen(new CompanyAddCommand({ ownerUid, description: company.preferences.name }));
        company.ledgerUid = item.uid;
        return company;
    }

    public async companyPaymentAggregatorGet(type: PaymentAggregatorType): Promise<CompanyEntity> {
        let query = this.database.company.createQueryBuilder('company');
        this.database.addCompanyRelations(query);
        query.where(`company.type  = :type`, { type: CompanyType.PAYMENT_AGGREGATOR });
        query.andWhere(`companyPreferences.name  = :name`, { name: type });
        return query.getOne();
    }

    public async companyPaymentAggregatorAdd(type: PaymentAggregatorType): Promise<CompanyEntity> {
        let user = await this.userRootGet();

        this.api.setSigner({ uid: user.ledgerUid, isDisableDecryption: true });
        let companyLedger = await this.api.ledgerRequestSendListen(new CompanyAddCommand({ ownerUid: user.ledgerUid, description: type }));

        let item = new CompanyEntity();
        item.type = CompanyType.PAYMENT_AGGREGATOR;
        item.status = CompanyStatus.ACTIVE;
        item.ledgerUid = companyLedger.uid;

        let preferences = item.preferences = new CompanyPreferencesEntity();
        preferences.name = type;
        preferences.title = preferences.description = preferences.nameShort = preferences.ceo = preferences.inn = preferences.kpp = preferences.ogrn = preferences.address = `${type}_${RandomUtil.randomString()}`;
        preferences.founded = new Date();
        preferences.picture = 'https://picsum.photos/200';

        item.paymentAggregator = new CompanyPaymentAggregatorEntity({ uid: type, type });
        item.paymentAggregator.key = await this.transport.sendListen(new CryptoEncryptCommand({ type: CryptoKeyType.DATABASE, value: Ed25519.keys().privateKey }));

        await this.database.getConnection().transaction(async manager => {
            let companyRepository = manager.getRepository(CompanyEntity);
            let roleRepository = manager.getRepository(UserRoleEntity);

            item = await companyRepository.save(item);
            await roleRepository.save(Object.values(LedgerCompanyRole).map(name => new UserRoleEntity(user.id, name, item.id)));
        });
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Coin Methods
    //
    // --------------------------------------------------------------------------

    public async coinEmit(transaction: PaymentTransactionEntity, from?: string): Promise<void> {
        this.api.setSigner({ uid: LedgerService.USER_ROOT_LEDGER_UID, isDisableDecryption: true });

        let dto: ICoinEmitDto = {
            to: null,
            type: transaction.type,
            amount: { value: transaction.amount, coinId: transaction.coinId, decimals: 2 },
            details: { transactionId: transaction.id.toString() },
            from
        }

        if (!_.isNil(transaction.projectId)) {
            let project = await this.database.projectGet(transaction.projectId);
            UserGuard.checkProject({ isProjectRequired: true, isProjectLedgerRequired: true }, project);

            dto.to = { uid: project.ledgerUid, type: CoinObjectType.PROJECT };
        }
        else if (!_.isNil(transaction.companyId)) {
            let company = await this.database.companyGet(transaction.companyId);
            UserGuard.checkCompany({ isCompanyRequired: true, isCompanyLedgerRequired: true }, company);

            dto.to = { uid: company.ledgerUid, type: CoinObjectType.COMPANY };
        }
        let command = new CoinEmitCommand(dto);
        await this.api.ledgerRequestSendListen(command);

        transaction.activatedDate = new Date();
        transaction.ledgerTransaction = command.id;
        await this.database.paymentTransaction.save(transaction);
    }

    // --------------------------------------------------------------------------
    //
    //  User Methods
    //
    // --------------------------------------------------------------------------

    public async userAdd(user: UserEntity): Promise<UserEntity> {
        if (!_.isNil(user.ledgerUid)) {
            return user;
        }

        this.api.setSigner({ uid: LedgerService.USER_ROOT_LEDGER_UID, isDisableDecryption: true });
        let item = await this.api.ledgerRequestSendListen(new UserAddCommand({
            description: user.preferences.name,
            cryptoKey: {
                value: user.cryptoKey.publicKey,
                algorithm: user.cryptoKey.algorithm,
            }
        }));
        user.ledgerUid = item.uid;
        return user;
    }

    public async userRootGet(): Promise<UserEntity> {
        return this.database.user.findOne({ login: LedgerService.USER_ROOT_LOGIN });
    }

    public async userRootLegerGet(): Promise<LedgerUser> {
        return this.api.ledgerRequestSendListen(new UserGetCommand({ uid: LedgerService.USER_ROOT_LEDGER_UID, details: ['cryptoKey', 'roles', 'description'] }));
    }

}