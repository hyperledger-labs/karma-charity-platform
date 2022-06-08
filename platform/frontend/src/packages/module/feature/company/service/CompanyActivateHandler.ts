import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { CompanyService } from '../../../core/service';
import { CompanyActivateCommand, ICompanyActivateDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class CompanyActivateHandler extends TransportCommandAsyncHandler<void, ICompanyActivateDtoResponse, CompanyActivateCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private company: CompanyService, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, CompanyActivateCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<ICompanyActivateDtoResponse> {
        await this.windows.question(`company.action.activate.confirmation`).yesNotPromise;
        let item = await this.api.companyActivate();
        if (this.company.isCompany(item)) {
            this.company.update(item);
        }
        this.notifications.info(`company.action.activate.notification`);
        return item;
    }
}
