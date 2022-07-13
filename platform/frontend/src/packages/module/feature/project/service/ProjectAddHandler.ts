import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { RouterService } from '@core/service';
import { ProjectAddCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class ProjectAddHandler extends TransportCommandHandler<void, ProjectAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private router: RouterService) {
        super(logger, transport, ProjectAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        this.router.navigate(RouterService.PROJECT_ADD_URL);
    }
}
