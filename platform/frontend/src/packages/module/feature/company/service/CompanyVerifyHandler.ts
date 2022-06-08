import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { CompanyService } from '../../../core/service';
import { CompanyVerifyCommand, ICompanyVerifyDto, ICompanyVerifyDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class CompanyVerifyHandler extends TransportCommandAsyncHandler<ICompanyVerifyDto, ICompanyVerifyDtoResponse, CompanyVerifyCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private company: CompanyService, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, CompanyVerifyCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICompanyVerifyDto): Promise<ICompanyVerifyDtoResponse> {
        await this.windows.question(`company.action.verify.confirmation`).yesNotPromise;
        let item = await this.api.companyVerify(params.id);
        if (this.company.isCompany(item)) {
            this.company.update(item);
        }
        this.notifications.info(`company.action.verify.notification`);
        return item;
    }
}
