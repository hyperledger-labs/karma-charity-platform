import { TransformUtil, ValidateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { LedgerErrorCode, LedgerError } from '@project/common/ledger/error';
import { LedgerCompany } from '@project/common/ledger/company';
import { WalletManager } from '../wallet/WalletManager';
import { UserManager } from '../user';
import { LedgerWallet } from '@project/common/ledger/wallet';
import { LedgerUser } from '@project/common/ledger/user';
import { IPaginableBookmark, IPaginationBookmark } from '@ts-core/common/dto';
import { LedgerProject } from '@project/common/ledger/project';
import { ProjectManager } from '../project/ProjectManager';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { EntityManager } from '@hlf-core/transport/chaincode/database/entity';
import { UID, getUid } from '@ts-core/common/dto';

export class CompanyManager extends EntityManager<LedgerCompany> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX_LINK = 'companyLink';

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private user: UserManager;
    private wallet: WalletManager;
    private project: ProjectManager;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async loadDetails(item: LedgerCompany, details?: Array<keyof LedgerCompany>): Promise<void> {
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
        await this.projectsRemove(item);
        await this.usersRemove(item);

        await this.stub.removeState(this.getDescriptionKey(item));
        await super.remove(item);
    }

    public initialize(user: UserManager, wallet: WalletManager, project: ProjectManager): void {
        this.user = user;
        this.wallet = wallet;
        this.project = project;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.user = null;
        this.wallet = null;
        this.project = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async deserialize(item: any, details?: Array<keyof LedgerCompany>): Promise<LedgerCompany> {
        if (_.isNil(item)) {
            return null;
        }
        let value = TransformUtil.toClass(LedgerCompany, item);
        ValidateUtil.validate(value);

        await this.loadDetails(value, details);
        return value;
    }

    protected async serialize(item: LedgerCompany): Promise<any> {
        if (!(item instanceof LedgerCompany)) {
            throw new LedgerError(LedgerErrorCode.BAD_REQUEST, `Not instance of LedgerCompany`, item);
        }
        ValidateUtil.validate(item);

        delete item.wallet;
        delete item.description;
        return TransformUtil.fromClass(item);
    }

    // --------------------------------------------------------------------------
    //
    //  User Methods
    //
    // --------------------------------------------------------------------------

    public async userList(company: UID, data: IPaginableBookmark<LedgerUser>): Promise<IPaginationBookmark<LedgerUser>> {
        return this.user.findPaginated(data, { prefix: this.getUserKey(company), transform: (item: string) => this.stub.getState(item) });
    }

    public async userRoleList(company: UID, user: UID): Promise<Array<LedgerCompanyRole>> {
        let items = await this.stub.getStateRaw(this.getUserRoleKey(company, user));
        return !_.isNil(items) ? (items.split(',') as Array<LedgerCompanyRole>) : [];
    }

    public async userAdd(company: UID, user: UID): Promise<void> {
        await this.stub.putStateRaw(this.getUserKey(company, user), getUid(user));
    }

    public async userRemove(company: UID, user: UID): Promise<void> {
        await this.stub.removeState(this.getUserKey(company, user));
        await this.stub.removeState(this.getUserRoleKey(company, user));
    }

    public async userRoleSet(company: UID, user: UID, roles: Array<LedgerCompanyRole>): Promise<void> {
        await this.stub.putStateRaw(this.getUserRoleKey(company, user), !_.isNil(roles) ? roles.join(',') : '');
    }

    protected async usersRemove(company: UID): Promise<void> {
        let kv = await this.getKV(this.getUserKey(company));
        await Promise.all(kv.map(item => this.userRemove(company, item.value)));
        await Promise.all(kv.map(item => this.user.companyRemove(item.value, company)));
    }

    protected getUserRoleKey(company: UID, user?: UID): string {
        let item = `→${this.prefix}~role:${getUid(company)}`;
        return !_.isNil(user) ? `${item}~${getUid(user)}` : item;
    }

    protected getUserKey(company: UID, user?: UID): string {
        let item = `→${this.prefix}~${this.user.prefix}:${getUid(company)}`;
        return !_.isNil(user) ? `${item}~${getUid(user)}` : item;
    }

    // --------------------------------------------------------------------------
    //
    //  Project Methods
    //
    // --------------------------------------------------------------------------

    public async projectList(company: UID, data: IPaginableBookmark<LedgerProject>): Promise<IPaginationBookmark<LedgerProject>> {
        return this.project.findPaginated(data, {
            prefix: this.getProjectKey(company),
            transform: (item: string) => this.stub.getState(item)
        });
    }

    public async projectAdd(company: UID, project: UID): Promise<void> {
        if (_.isNil(company) || _.isNil(project)) {
            return;
        }
        let key = this.getProjectKey(company, project);
        await this.stub.putStateRaw(key, getUid(project));
    }

    public async projectRemove(company: UID, project: UID): Promise<void> {
        if (_.isNil(company) || _.isNil(project)) {
            return;
        }
        let key = this.getProjectKey(company, project);
        await this.stub.removeState(key);
    }

    protected async projectsRemove(company: UID): Promise<void> {
        let kv = await this.getKV(this.getProjectKey(company));
        await Promise.all(kv.map(item => this.projectRemove(company, item.value)));
        await Promise.all(kv.map(item => this.project.companyRemove(item.value, company)));
    }

    protected getProjectKey(company: UID, project?: UID): string {
        let item = `→${this.prefix}~${this.project.prefix}:${getUid(company)}`;
        return !_.isNil(project) ? `${item}~${getUid(project)}` : item;
    }

    // --------------------------------------------------------------------------
    //
    //  Wallet Methods
    //
    // --------------------------------------------------------------------------

    public async walletGet(company: UID): Promise<LedgerWallet> {
        return this.wallet.get(this.getWalletUid(company));
    }

    public async walletSet(company: UID, wallet: LedgerWallet): Promise<void> {
        if (_.isNil(company) || _.isNil(wallet)) {
            return;
        }
        wallet.uid = this.getWalletUid(company);
        await this.wallet.save(wallet);
    }

    protected getWalletUid(company: UID): string {
        return `→${this.prefix}~${this.wallet.prefix}:${getUid(company)}`;
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
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get prefix(): string {
        return LedgerCompany.PREFIX;
    }
}
