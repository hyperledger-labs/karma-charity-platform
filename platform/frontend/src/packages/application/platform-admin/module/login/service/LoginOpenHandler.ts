import { Injectable } from '@angular/core';
import { WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { PromiseHandler } from '@ts-core/common/promise';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { LoginContainerComponent } from '../../../../../module/feature/login/component';
import { takeUntil } from 'rxjs';
import { LoginOpenCommand, ILoginOpenDtoResponse } from '../../../../../module/feature/login/transport';

@Injectable({ providedIn: 'root' })
export class LoginOpenHandler extends TransportCommandAsyncHandler<void, ILoginOpenDtoResponse, LoginOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService) {
        super(logger, transport, LoginOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<ILoginOpenDtoResponse> {
        let windowId = 'loginOpen';
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let config = new WindowConfig(true, false, 600);
        config.id = windowId;
        let promise = PromiseHandler.create<ILoginOpenDtoResponse>();

        let content = this.windows.open(LoginContainerComponent, config) as LoginContainerComponent;
        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case WindowEvent.CLOSED:
                    if (content.serialize()) {
                        promise.resolve({});
                    } else {
                        promise.reject();
                    }
                    break;
            }
        });
        return promise.promise;
    }
}
