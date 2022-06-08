import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { CoinObjectType } from 'common/transport/command/coin';
import { WindowConfig, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { ProjectContainerComponent } from '../component';
import { ProjectOpenCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class ProjectOpenHandler extends TransportCommandHandler<number, ProjectOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private api: Client) {
        super(logger, transport, ProjectOpenCommand.NAME);
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

        
        let project = await this.api.projectGet(params);

        let config = new WindowConfig(false, false, 800, 600);
        config.id = windowId;

        let content = this.windows.open(ProjectContainerComponent, config) as ProjectContainerComponent;
        content.project = project;
    }
}
