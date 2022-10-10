import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { DateUtil } from '@ts-core/common/util';
import { DatabaseService } from '@project/module/database/service';
import { Ledger } from '@hlf-explorer/common/ledger';
import { LedgerStateChecker } from './LedgerStateChecker';
import { Transport } from '@ts-core/common/transport';
import { LedgerApiMonitor } from './LedgerApiMonitor';
import * as _ from 'lodash';
import { LedgerSettingsFactory, ILedgerConnectionSettings } from './LedgerSettingsFactory';
import { ILedgerBatchSettings } from './LedgerSettingsFactory';
import { ExtendedError } from '@ts-core/common/error';
import { LedgerResetedEvent } from '../transport/event/LedgerResetedEvent';
import { LedgerBatchChecker } from './LedgerBatchChecker';
import { LedgerEntity } from '@project/module/database/ledger';

@Injectable()
export class LedgerService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private checkers: Map<string, LedgerStateChecker>;
    private batchers: Map<string, LedgerBatchChecker>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        logger: Logger,
        private transport: Transport,
        private database: DatabaseService,
        private monitor: LedgerApiMonitor,
        private settings: LedgerSettingsFactory
    ) {
        super(logger);
        this.checkers = new Map();
        this.batchers = new Map();
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async createLedger(settings: ILedgerConnectionSettings): Promise<Ledger> {
        let item = new LedgerEntity();
        item.name = settings.uid;
        item.blockHeight = 0;
        item.blockHeightParsed = 0;
        item.blockFrequency = 3 * DateUtil.MILISECONDS_SECOND;

        if (!_.isNil(settings.batch)) {
            item.isBatch = !_.isNil(settings.batch);
        }

        await this.database.ledgerSave(item);
        this.log(`Ledger "${settings.uid}" saved`);
        return item.toObject();
    }

    private async initializeBatchers(ledgers: Array<Ledger>): Promise<void> {
        this.batchers.forEach(item => item.destroy());
        this.batchers.clear();

        for (let ledger of ledgers) {
            if (!ledger.isBatch) {
                continue;
            }

            let settings = this.settings.get(ledger.name);
            if (_.isNil(settings.batch) || _.isBoolean(settings.batch)) {
                continue;
            }

            let item = this.batchers.get(ledger.name);
            if (!this.batchers.has(ledger.name)) {
                item = new LedgerBatchChecker(this.logger, this.transport, ledger, settings.batch);
                this.batchers.set(ledger.name, item);
            }
            item.start();
        }
    }

    private async initializeCheckers(ledgers: Array<Ledger>): Promise<void> {
        this.checkers.forEach(item => item.destroy());
        this.checkers.clear();

        for (let ledger of ledgers) {
            let item = this.checkers.get(ledger.name);
            if (!this.checkers.has(ledger.name)) {
                item = new LedgerStateChecker(this.logger, this.transport, ledger);
                this.checkers.set(ledger.name, item);
            }
            item.start();
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async initialize(): Promise<void> {
        let names = this.settings.items.collection.map(item => item.uid);
        this.log(`Initializing, found ${names.join(',')} ledgers...`);

        this.checkers.forEach(item => item.destroy());
        this.checkers.clear();

        let ledgers = [];
        for (let settings of this.settings.items.collection) {
            let ledger = (await this.ledgerGet(settings.uid)) || (await this.createLedger(settings));
            settings.id = ledger.id;
            ledgers.push(ledger);
        }
        await this.initializeCheckers(ledgers);
        await this.initializeBatchers(ledgers);
        await this.monitor.initialize(ledgers);

        // await this.ledgerReset('Karma');
        // this.transport.send(new LedgerBlockParseCommand({ ledgerId: 1, isBatch: true, number: 33 }));
    }

    public async ledgerGet(name: string): Promise<Ledger> {
        let item = await this.database.ledger.findOne({ name });
        return !_.isNil(item) ? item.toObject() : null;
    }

    public async ledgerReset(name: string): Promise<Ledger> {
        let item = await this.database.ledger.findOne({ name });
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find "${name}" ledger`);
        }

        let checkers = _.compact([this.checkers.get(name), this.batchers.get(name)]);
        checkers.forEach(item => item.stop());

        await this.database.ledgerBlockTransaction.delete({ ledgerId: item.id });
        await this.database.ledgerBlockEvent.delete({ ledgerId: item.id });
        await this.database.ledgerBlock.delete({ ledgerId: item.id });

        await this.database.ledger.update(item.id, { blockHeight: 0, blockHeightParsed: 0 });
        this.transport.dispatch(new LedgerResetedEvent({ ledgerId: item.id }));

        checkers.forEach(item => item.start());

        this.log(`Ledger ${name} reseted`);
        return item;
    }
}
