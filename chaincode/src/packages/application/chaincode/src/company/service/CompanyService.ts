import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { IUserStubHolder } from '@project/module/core/guard';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import * as _ from 'lodash';
import { ICompanyAddDto } from '@project/common/transport/command/company';
import { CompanyAddedEvent, CompanyUserAddedEvent } from '@project/common/transport/event/company';
import { LedgerCompany, LedgerCompanyStatus } from '@project/common/ledger/company';
import { LedgerWallet } from '@project/common/ledger/wallet';

@Injectable()
export class CompanyService extends LoggerWrapper {
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

    public async add(holder: IUserStubHolder, params: ICompanyAddDto, isDefaultRootCompany?: boolean): Promise<LedgerCompany> {
        let item = !isDefaultRootCompany
            ? LedgerCompany.create(holder.stub.transactionDate, holder.stub.transactionHash)
            : LedgerCompany.createRoot();
        item.status = LedgerCompanyStatus.ACTIVE;
        await holder.db.company.save(item);

        let wallet = (item.wallet = new LedgerWallet());
        await holder.db.company.walletSet(item, wallet);

        if (!_.isNil(params.description)) {
            item.description = params.description;
            await holder.db.company.descriptionSet(item, params.description);
        }
        await holder.stub.dispatch(new CompanyAddedEvent(holder.eventData));
        await this.userAdd(holder, item.uid, params.ownerUid, Object.values(LedgerCompanyRole));
        return item;
    }

    public async userAdd(holder: IUserStubHolder, companyUid: string, userUid: string, roles: Array<LedgerCompanyRole>): Promise<void> {
        await holder.db.user.companyAdd(userUid, companyUid);
        await holder.db.company.userAdd(companyUid, userUid);
        if (!_.isNil(roles)) {
            await holder.db.company.userRoleSet(companyUid, userUid, roles);
        }
        await holder.stub.dispatch(new CompanyUserAddedEvent(holder.eventData));
    }
}
