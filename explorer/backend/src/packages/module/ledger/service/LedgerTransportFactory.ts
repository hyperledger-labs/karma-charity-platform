import { Logger, LoggerWrapper } from '@ts-core/common';
import * as _ from 'lodash';
import { ILedgerConnectionSettings, LedgerSettingsFactory } from './LedgerSettingsFactory';
import { Injectable } from '@nestjs/common';
import { TransportFabric, TransportFabricBatch } from '@hlf-core/transport';

@Injectable()
export class LedgerTransportFactory extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected items: Map<number, LedgerFabric>;

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

    public async get(ledgerId: number): Promise<LedgerFabric> {
        let item = this.items.get(ledgerId);
        if (!_.isNil(item)) {
            if (!item.isConnected) {
                await item.connect();
            }
            return item;
        }
        let settings = this.settings.getById(ledgerId);
        item = _.isBoolean(settings.batch) && !settings.batch ? new LedgerFabric(this.logger, settings) : new LedgerFabricBatch(this.logger, settings);
        this.items.set(ledgerId, item);
        await item.connect();
        return item;
    }
}

class LedgerFabric extends TransportFabric<ILedgerConnectionSettings> { }
class LedgerFabricBatch extends TransportFabricBatch<ILedgerConnectionSettings> { }
