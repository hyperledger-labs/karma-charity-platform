import { TraceUtil, ILogger, Transport } from '@ts-core/common';
import { LedgerStateChecker } from './LedgerStateChecker';
import { Ledger } from '@hlf-explorer/common';
import { ILedgerBatchSettings } from './LedgerSettingsFactory';
import { LedgerBatchCommand } from '../transport/command/LedgerBatchCommand';

export class LedgerBatchChecker extends LedgerStateChecker {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, transport: Transport, ledger: Ledger, protected settings: ILedgerBatchSettings) {
        super(logger, transport, ledger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async start(): Promise<void> {
        this.timerStart(this.settings.timeout);
        this.check();
    }

    public async check(): Promise<void> {
        this.transport.send(new LedgerBatchCommand(TraceUtil.addIfNeed({ ledgerId: this.ledger.id })), { timeout: this.timeout });
    }
}
