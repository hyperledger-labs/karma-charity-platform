import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { WindowConfig, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { CompanyContainerComponent } from '../component';
import { CompanyOpenCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class CompanyOpenHandler extends TransportCommandHandler<number, CompanyOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private api: Client) {
        super(logger, transport, CompanyOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: number): Promise<void> {
        let windowId = 'companyOpen' + params;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let company = await this.api.companyGet(params);

        let config = new WindowConfig(false, false, 800, 600);
        config.id = windowId;

        let content = this.windows.open(CompanyContainerComponent, config) as CompanyContainerComponent;
        content.company = company;
    }
}
