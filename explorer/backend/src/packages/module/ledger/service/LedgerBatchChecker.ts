import { TraceUtil } from '@ts-core/common/trace';
import { LedgerStateChecker } from './LedgerStateChecker';
import { Ledger } from '@hlf-explorer/common/ledger';
import { Transport } from '@ts-core/common/transport';
import { ILedgerBatchSettings } from './LedgerSettingsFactory';
import { LedgerBatchCommand } from '../transport/command/LedgerBatchCommand';
import { ILogger } from '@ts-core/common/logger';

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
