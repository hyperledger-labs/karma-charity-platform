import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { CompanyService } from '../../../core/service';
import { CompanyToVerifyCommand, ICompanyToVerifyDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class CompanyToVerifyHandler extends TransportCommandAsyncHandler<void, ICompanyToVerifyDtoResponse, CompanyToVerifyCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private company: CompanyService, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, CompanyToVerifyCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<ICompanyToVerifyDtoResponse> {
        await this.windows.question(`company.action.toVerify.confirmation`).yesNotPromise;
        let item = await this.api.companyToVerify();
        if (this.company.isCompany(item)) {
            this.company.update(item);
        }
        this.notifications.info(`company.action.toVerify.notification`);
        return item;

    }
}
