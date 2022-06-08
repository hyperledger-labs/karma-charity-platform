import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { WindowConfig, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { PaymentContainerComponent } from '../component';
import { PaymentOpenCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class PaymentOpenHandler extends TransportCommandHandler<number, PaymentOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private api: Client) {
        super(logger, transport, PaymentOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: number): Promise<void> {
        let windowId = 'paymentOpen' + params;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let payment = await this.api.paymentGet(params);

        let config = new WindowConfig(false, false, 800, 600);
        config.id = windowId;

        let content = this.windows.open(PaymentContainerComponent, config) as PaymentContainerComponent;
        content.payment = payment;
    }
}
