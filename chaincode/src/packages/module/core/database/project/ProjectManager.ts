import { EntityManager } from '@hlf-core/transport/chaincode/database/entity';
import { LedgerProject } from '@project/common/ledger/project';
import { TransformUtil, ValidateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { LedgerErrorCode, LedgerError } from '@project/common/ledger/error';
import { CompanyManager } from '../company';
import { WalletManager } from '../wallet/WalletManager';
import { LedgerWallet } from '@project/common/ledger/wallet';
import { UserManager } from '../user';
import { LedgerUser } from '@project/common/ledger/user';
import { IPaginableBookmark, IPaginationBookmark } from '@ts-core/common/dto';
import { LedgerProjectRole } from '@project/common/ledger/role';
import { UID, getUid } from '@ts-core/common/dto';

export class ProjectManager extends EntityManager<LedgerProject> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX_LINK = 'project';

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private user: UserManager;
    private wallet: WalletManager;
    private company: CompanyManager;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async loadDetails(item: LedgerProject, details?: Array<keyof LedgerProject>): Promise<void> {
        if (_.isEmpty(details)) {
            return;
        }

        if (_.isNil(item.description) && details.includes('description')) {
            item.description = await this.descriptionGet(item);
        }

        if (_.isNil(item.wallet) && details.includes('wallet')) {
            item.wallet = await this.walletGet(item);
        }
    }

    public async remove(item: UID): Promise<void> {
        await this.wallet.remove(this.getWalletUid(item));
        await this.companiesRemove(item);
        await this.usersRemove(item);

        await this.stub.removeState(this.getDescriptionKey(item));
        await super.remove(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async deserialize(item: any, details?: Array<keyof LedgerProject>): Promise<LedgerProject> {
        if (_.isNil(item)) {
            return null;
        }
        let value = TransformUtil.toClass(LedgerProject, item);
        ValidateUtil.validate(value);

        await this.loadDetails(value, details);
        return value;
    }

    protected async serialize(item: LedgerProject): Promise<any> {
        if (!(item instanceof LedgerProject)) {
            throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Not instance of LedgerProject`, item);
        }
        ValidateUtil.validate(item);

        delete item.wallet;
        delete item.description;
        return TransformUtil.fromClass(item);
    }

    public initialize(user: UserManager, wallet: WalletManager, company: CompanyManager): void {
        this.user = user;
        this.wallet = wallet;
        this.company = company;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        
        this.user = null;
        this.wallet = null;
        this.company = null;
    }

    // --------------------------------------------------------------------------
    //
    //  User Methods
    //
    // --------------------------------------------------------------------------

    public async userList(project: UID, data: IPaginableBookmark<LedgerUser>): Promise<IPaginationBookmark<LedgerUser>> {
        return this.user.findPaginated(data, { prefix: this.getUserKey(project), transform: (item: string) => this.stub.getState(item) });
    }

    public async userRoleList(project: UID, user: UID): Promise<Array<LedgerProjectRole>> {
        let items = await this.stub.getStateRaw(this.getUserRoleKey(project, user));
        return !_.isNil(items) ? (items.split(',') as Array<LedgerProjectRole>) : [];
    }

    public async userAdd(project: UID, user: UID): Promise<void> {
        await this.stub.putStateRaw(this.getUserKey(project, user), getUid(user));
    }

    public async userRemove(project: UID, user: UID): Promise<void> {
        await this.stub.removeState(this.getUserKey(project, user));
        await this.stub.removeState(this.getUserRoleKey(project, user));
    }

    public async userRoleSet(project: UID, user: UID, roles: Array<LedgerProjectRole>): Promise<void> {
        await this.stub.putStateRaw(this.getUserRoleKey(project, user), !_.isNil(roles) ? roles.join(',') : '');
    }

    protected async usersRemove(project: UID): Promise<void> {
        let kv = await this.getKV(this.getUserKey(project));
        await Promise.all(kv.map(item => this.userRemove(project, item.value)));
        await Promise.all(kv.map(item => this.user.projectRemove(item.value, project)));
    }

    protected getUserRoleKey(project: UID, user?: UID): string {
        let item = `→${this.prefix}~role:${getUid(project)}`;
        return !_.isNil(user) ? `${item}~${getUid(user)}` : item;
    }

    protected getUserKey(project: UID, user?: UID): string {
        let item = `→${this.prefix}~${this.user.prefix}:${getUid(project)}`;
        return !_.isNil(user) ? `${item}~${getUid(user)}` : item;
    }

    // --------------------------------------------------------------------------
    //
    //  Company Methods
    //
    // --------------------------------------------------------------------------

    public getCompanyKey(project: UID, company?: UID): string {
        let item = `→${this.prefix}~${this.company.prefix}:${getUid(project)}`;
        return !_.isNil(company) ? `${item}~${getUid(company)}` : item;
    }

    public async companyAdd(project: UID, company: UID): Promise<void> {
        let keyLinked = this.getCompanyKey(project, company);
        await this.stub.putStateRaw(keyLinked, getUid(company));
    }

    public async companyRemove(project: UID, company: UID): Promise<void> {
        let keyLinked = this.getCompanyKey(project, company);
        await this.stub.removeState(keyLinked);
    }

    protected async companiesRemove(project: UID): Promise<void> {
        let kv = await this.getKV(this.getCompanyKey(project));
        await Promise.all(kv.map(item => this.companyRemove(project, item.value)));
        await Promise.all(kv.map(item => this.company.projectRemove(item.value, project)));
    }

    // --------------------------------------------------------------------------
    //
    //  Wallet Methods
    //
    // --------------------------------------------------------------------------

    public async walletGet(project: UID): Promise<LedgerWallet> {
        return this.wallet.get(this.getWalletUid(project));
    }

    public async walletSet(project: UID, wallet: LedgerWallet): Promise<void> {
        if (_.isNil(project) || _.isNil(wallet)) {
            return;
        }
        wallet.uid = this.getWalletUid(project);
        await this.wallet.save(wallet);
    }

    protected getWalletUid(project: UID): string {
        return `→${this.prefix}~${this.wallet.prefix}:${getUid(project)}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Description Methods
    //
    // --------------------------------------------------------------------------

    public async descriptionGet(project: UID): Promise<string> {
        return this.stub.getStateRaw(this.getDescriptionKey(project));
    }

    public async descriptionSet(project: UID, description: string): Promise<void> {
        if (_.isNil(project) || _.isNil(description)) {
            return;
        }
        await this.stub.putStateRaw(this.getDescriptionKey(project), description);
    }

    protected getDescriptionKey(project: UID): string {
        return `→${this.prefix}~description:${getUid(project)}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get prefix(): string {
        return LedgerProject.PREFIX;
    }
}
