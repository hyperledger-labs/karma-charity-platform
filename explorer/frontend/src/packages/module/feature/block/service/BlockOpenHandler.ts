import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { RouterService } from '@core/service';
import { BlockOpenCommand, IBlockOpenDto } from '../transport';

@Injectable({ providedIn: 'root' })
export class BlockOpenHandler extends TransportCommandHandler<IBlockOpenDto, BlockOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private router: RouterService) {
        super(logger, transport, BlockOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IBlockOpenDto): Promise<void> {
        this.router.blockOpen(params);
    }
}
