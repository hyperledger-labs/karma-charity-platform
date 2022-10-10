import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { TransportFabricSender } from '@hlf-core/transport/client';
import * as _ from 'lodash';
import { ILedgerConnectionSettings, LedgerSettingsFactory } from './LedgerSettingsFactory';
import { Injectable } from '@nestjs/common';
import { TransportFabricSenderBatch } from '@hlf-core/transport/client/batch';

@Injectable()
export class LedgerTransportFactory extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected items: Map<number, LedgerFabricSender>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private settings: LedgerSettingsFactory) {
        super(logger);
        this.items = new Map();
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async get(ledgerId: number): Promise<LedgerFabricSender> {
        let item = this.items.get(ledgerId);
        if (!_.isNil(item)) {
            if (!item.isConnected) {
                await item.connect();
            }
            return item;
        }
        item = new LedgerFabricSender(this.logger, this.settings.getById(ledgerId));
        this.items.set(ledgerId, item);
        await item.connect();
        return item;
    }
}

export class LedgerFabricSender extends TransportFabricSenderBatch<ILedgerConnectionSettings> {}
