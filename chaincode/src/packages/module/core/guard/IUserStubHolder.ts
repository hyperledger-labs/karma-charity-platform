import { LedgerUser } from '@project/common/ledger/user';
import { UserManager } from '../database/user';
import { CompanyManager } from '../database/company';
import { WalletManager } from '../database/wallet/WalletManager';
import { WalletAccountManager } from '../database/wallet/WalletAccountManager';
import { ProjectManager } from '../database/project';
import { ILogger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { IDestroyable, DestroyableContainer } from '@ts-core/common';
import { IKarmaLedgerEventDto } from '@project/common/transport/event';
import { ITransportCommand } from '@ts-core/common/transport';
import { ITransportFabricStubHolder, ITransportFabricStub } from '@hlf-core/transport/chaincode/stub';

export interface IUserStubHolder<U = any> extends ITransportFabricStubHolder, ITransportCommand<U> {
    db?: IDBManager;
    user?: LedgerUser;
    eventData?: IKarmaLedgerEventDto;
}

export interface IDBManager extends IDestroyable {
    user?: UserManager;
    wallet?: WalletManager;
    project?: ProjectManager;
    company?: CompanyManager;
    walletAccount?: WalletAccountManager;
}

export class DBManager extends DestroyableContainer implements IDBManager {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private _user: UserManager;
    private _wallet: WalletManager;
    private _company: CompanyManager;
    private _project: ProjectManager;
    private _walletAccount: WalletAccountManager;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, stub: ITransportFabricStub) {
        super();
        this._user = this.addDestroyable(new UserManager(logger, stub));
        this._wallet = this.addDestroyable(new WalletManager(logger, stub));
        this._company = this.addDestroyable(new CompanyManager(logger, stub));
        this._project = this.addDestroyable(new ProjectManager(logger, stub));
        this._walletAccount = this.addDestroyable(new WalletAccountManager(logger, stub));

        this._user.initialize(this.company, this.project);
        this._wallet.initialize(this.walletAccount);
        this._company.initialize(this.user, this.wallet, this.project);
        this._project.initialize(this.user, this.wallet, this.company);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get user(): UserManager {
        return this._user;
    }

    public get wallet(): WalletManager {
        return this._wallet;
    }

    public get project(): ProjectManager {
        return this._project;
    }

    public get company(): CompanyManager {
        return this._company;
    }

    public get walletAccount(): WalletAccountManager {
        return this._walletAccount;
    }
}
