import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { FileRemoveCommand, IFileRemoveDto, IFileRemoveDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class FileRemoveHandler extends TransportCommandAsyncHandler<IFileRemoveDto, IFileRemoveDtoResponse, FileRemoveCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, FileRemoveCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IFileRemoveDto): Promise<IFileRemoveDtoResponse> {
        await this.windows.question(`file.action.remove.confirmation`).yesNotPromise;
        let item = await this.api.fileRemove(params);
        this.notifications.info(`file.action.remove.notification`);
        return item;
    }
}
