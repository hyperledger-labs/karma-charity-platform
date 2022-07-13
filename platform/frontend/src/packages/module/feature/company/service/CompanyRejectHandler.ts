import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { CompanyService } from '@core/service';
import { CompanyRejectCommand, ICompanyRejectDto, ICompanyRejectDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class CompanyRejectHandler extends TransportCommandAsyncHandler<ICompanyRejectDto, ICompanyRejectDtoResponse, CompanyRejectCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private company: CompanyService, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, CompanyRejectCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICompanyRejectDto): Promise<ICompanyRejectDtoResponse> {
        await this.windows.question(`company.action.reject.confirmation`).yesNotPromise;
        let item = await this.api.companyReject(params.id);
        if (this.company.isCompany(item)) {
            this.company.update(item);
        }
        this.notifications.info(`company.action.reject.notification`);
        return item;
    }
}
