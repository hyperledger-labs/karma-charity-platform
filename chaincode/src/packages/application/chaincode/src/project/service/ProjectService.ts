import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { IUserStubHolder } from '@project/module/core/guard';
import { LedgerProjectRole } from '@project/common/ledger/role';
import * as _ from 'lodash';
import { LedgerWallet } from '@project/common/ledger/wallet';
import { IProjectAddDto } from '@project/common/transport/command/project';
import { LedgerProject, LedgerProjectStatus } from '@project/common/ledger/project';
import { ProjectAddedEvent, ProjectUserAddedEvent } from '@project/common/transport/event/project';

@Injectable()
export class ProjectService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async add(holder: IUserStubHolder, params: IProjectAddDto): Promise<LedgerProject> {
        let item = LedgerProject.create(holder.stub.transactionDate, holder.stub.transactionHash);
        item.status = LedgerProjectStatus.ACTIVE;
        item.companyUid = params.companyUid;
        await holder.db.project.save(item);

        let wallet = (item.wallet = new LedgerWallet());
        await holder.db.project.walletSet(item, wallet);

        if (!_.isNil(params.description)) {
            params.description = params.description;
            await holder.db.project.descriptionSet(item, params.description);
        }
        await holder.stub.dispatch(new ProjectAddedEvent(holder.eventData));
        await this.companyAdd(holder, item.uid, params.companyUid);
        await this.userAdd(holder, item.uid, params.ownerUid, Object.values(LedgerProjectRole));
        return item;
    }

    public async companyAdd(holder: IUserStubHolder, projectUid: string, companyUid: string): Promise<void> {
        await holder.db.company.projectAdd(companyUid, projectUid);
        await holder.db.project.companyAdd(projectUid, companyUid);
    }

    public async userAdd(holder: IUserStubHolder, projectUid: string, userUid: string, roles: Array<LedgerProjectRole>): Promise<void> {
        await holder.db.user.projectAdd(userUid, projectUid);
        await holder.db.project.userAdd(projectUid, userUid);
        if (!_.isNil(roles)) {
            await holder.db.project.userRoleSet(projectUid, userUid, roles);
        }
        await holder.stub.dispatch(new ProjectUserAddedEvent(holder.eventData));
    }
}
