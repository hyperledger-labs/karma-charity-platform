import { LedgerUser } from '@project/common/ledger/user';
import { TransformUtil, ValidateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { ILogger } from '@ts-core/common/logger';
import { EntityManager } from '@hlf-core/transport/chaincode/database/entity';
import { CryptoKeyManager } from '../cryptoKey';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { CompanyManager } from '../company';
import { LedgerCompany } from '@project/common/ledger/company';
import { LedgerCryptoKey } from '@project/common/ledger/cryptoKey';
import { IPaginableBookmark, IPaginationBookmark } from '@ts-core/common/dto';
import { LedgerRole } from '@project/common/ledger/role';
import { LedgerProject } from '@project/common/ledger/project';
import { ProjectManager } from '../project';
import { ITransportFabricStub } from '@hlf-core/transport/chaincode/stub';
import { UID, getUid } from '@ts-core/common/dto';

export class UserManager extends EntityManager<LedgerUser> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX_LINK = 'userLink';

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private project: ProjectManager;
    private company: CompanyManager;
    private _cryptoKey: CryptoKeyManager;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, stub: ITransportFabricStub) {
        super(logger, stub);
        this._cryptoKey = new CryptoKeyManager(logger, stub);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async loadDetails(item: LedgerUser, details?: Array<keyof LedgerUser>): Promise<void> {
        if (_.isEmpty(details)) {
            return;
        }

        if (_.isNil(item.description) && details.includes('description')) {
            item.description = await this.descriptionGet(item);
        }

        if (_.isNil(item.cryptoKey) && details.includes('cryptoKey')) {
            item.cryptoKey = await this.cryptoKeyGet(item);
        }

        if (_.isNil(item.roles) && details.includes('roles')) {
            item.roles = await this.roleList(item);
        }
    }

    public async remove(item: UID): Promise<void> {
        await this.cryptoKey.remove(this.getCryptoKeyUid(item));
        await this.companiesRemove(item);
        await this.projectsRemove(item);

        await this.stub.removeState(this.getDescriptionKey(item));
        await this.stub.removeState(this.getRoleKey(item));
        await super.remove(item);
    }

    public initialize(company: CompanyManager, project: ProjectManager): void {
        this.company = company;
        this.project = project;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this._cryptoKey.destroy();
        this._cryptoKey = null;

        this.company = null;
        this.project = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async deserialize(item: any, details?: Array<keyof LedgerUser>): Promise<LedgerUser> {
        if (_.isNil(item)) {
            return null;
        }
        let value = TransformUtil.toClass(LedgerUser, item);
        ValidateUtil.validate(value);

        await this.loadDetails(value, details);
        return value;
    }

    protected async serialize(item: LedgerUser): Promise<any> {
        if (!(item instanceof LedgerUser)) {
            throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Not instance of LedgerUser`, item);
        }

        ValidateUtil.validate(item);

        delete item.roles;
        delete item.cryptoKey;
        delete item.description;
        return TransformUtil.fromClass(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Company Methods
    //
    // --------------------------------------------------------------------------

    public async companyList(user: UID, data: IPaginableBookmark<LedgerCompany>): Promise<IPaginationBookmark<LedgerCompany>> {
        return this.company.findPaginated(data, {
            prefix: this.getCompanyKey(user),
            transform: (item: string) => this.stub.getState(item)
        });
    }

    public async companyAdd(user: UID, company: UID): Promise<void> {
        if (_.isNil(user) || _.isNil(company)) {
            return;
        }
        let key = this.getCompanyKey(user, company);
        await this.stub.putStateRaw(key, getUid(company));
    }

    public async companyRemove(user: UID, company: UID): Promise<void> {
        if (_.isNil(user) || _.isNil(company)) {
            return;
        }
        let key = this.getCompanyKey(user, company);
        await this.stub.removeState(key);
    }

    protected async companiesRemove(user: UID): Promise<void> {
        let kv = await this.getKV(this.getCompanyKey(user));
        await Promise.all(kv.map(item => this.companyRemove(user, item.value)));
        await Promise.all(kv.map(item => this.company.userRemove(item.value, user)));
    }

    protected getCompanyKey(user: UID, company?: UID): string {
        let item = `→${this.prefix}~${this.company.prefix}:${getUid(user)}`;
        return !_.isNil(company) ? `${item}~${getUid(company)}` : item;
    }

    // --------------------------------------------------------------------------
    //
    //  Project Methods
    //
    // --------------------------------------------------------------------------

    public async projectList(user: UID, data: IPaginableBookmark<LedgerProject>): Promise<IPaginationBookmark<LedgerProject>> {
        return this.project.findPaginated(data, {
            prefix: this.getProjectKey(user),
            transform: (item: string) => this.stub.getState(item)
        });
    }

    public async projectAdd(user: UID, project: UID): Promise<void> {
        if (_.isNil(user) || _.isNil(project)) {
            return;
        }
        let key = this.getProjectKey(user, project);
        await this.stub.putStateRaw(key, getUid(project));
    }

    public async projectRemove(user: UID, project: UID): Promise<void> {
        if (_.isNil(user) || _.isNil(project)) {
            return;
        }
        let key = this.getProjectKey(user, project);
        await this.stub.removeState(key);
    }

    protected async projectsRemove(user: UID): Promise<void> {
        let kv = await this.getKV(this.getProjectKey(user));
        await Promise.all(kv.map(item => this.projectRemove(user, item.value)));
        await Promise.all(kv.map(item => this.project.userRemove(item.value, user)));
    }

    protected getProjectKey(user: UID, project?: UID): string {
        let item = `→${this.prefix}~${this.project.prefix}:${getUid(user)}`;
        return !_.isNil(project) ? `${item}~${getUid(project)}` : item;
    }

    // --------------------------------------------------------------------------
    //
    //  Description Methods
    //
    // --------------------------------------------------------------------------

    public async descriptionGet(user: UID): Promise<string> {
        return this.stub.getStateRaw(this.getDescriptionKey(user));
    }

    public async descriptionSet(user: UID, description: string): Promise<void> {
        if (_.isNil(user) || _.isNil(description)) {
            return;
        }
        await this.stub.putStateRaw(this.getDescriptionKey(user), description);
    }

    protected getDescriptionKey(user: UID): string {
        return `→${this.prefix}~description:${getUid(user)}`;
    }

    // --------------------------------------------------------------------------
    //
    //  CryptoKey Methods
    //
    // --------------------------------------------------------------------------

    public async cryptoKeyGet(user: UID): Promise<LedgerCryptoKey> {
        return this.cryptoKey.get(this.getCryptoKeyUid(user));
    }

    public async cryptoKeySet(user: UID, cryptoKey: LedgerCryptoKey): Promise<void> {
        if (_.isNil(user) || _.isNil(cryptoKey)) {
            return;
        }
        cryptoKey.uid = this.getCryptoKeyUid(user);
        await this.cryptoKey.save(cryptoKey);
    }

    protected getCryptoKeyUid(user: UID): string {
        return `→${this.prefix}~${this.cryptoKey.prefix}:${getUid(user)}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Role Methods
    //
    // --------------------------------------------------------------------------

    public async roleList(user: UID): Promise<Array<LedgerRole>> {
        let items = await this.stub.getStateRaw(this.getRoleKey(user));
        return !_.isNil(items) ? (items.split(',') as Array<LedgerRole>) : [];
    }

    public async roleSet(user: UID, roles: Array<LedgerRole>): Promise<void> {
        await this.stub.putStateRaw(this.getRoleKey(user), !_.isNil(roles) ? roles.join(',') : '');
    }

    protected getRoleKey(user: UID): string {
        return `→${this.prefix}~role:${getUid(user)}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get prefix(): string {
        return LedgerUser.PREFIX;
    }

    public get cryptoKey(): CryptoKeyManager {
        return this._cryptoKey;
    }
}
