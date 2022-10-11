import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common';
import { Transport, TransportCommandHandler } from '@ts-core/common';
import * as _ from 'lodash';
import { SettingsService } from '@core/service';
import { PromiseHandler } from '@ts-core/common';
import { takeUntil } from 'rxjs';
import { FileOpenCommand, IFileOpenDto } from '../transport';
import { NativeWindowService } from '@ts-core/frontend';

@Injectable({ providedIn: 'root' })
export class FileOpenHandler extends TransportCommandHandler<IFileOpenDto, FileOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private nativeWindow: NativeWindowService) {
        super(logger, transport, FileOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IFileOpenDto): Promise<void> {
        await this.windows.question(`file.action.open.confirmation`).yesNotPromise;
        this.nativeWindow.open(params.path);
    }
}
