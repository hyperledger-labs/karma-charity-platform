
import { LoggerWrapper, ILogger, TraceUtil, Transport } from '@ts-core/common';
import { LedgerStateCheckCommand } from '@project/module/ledger/transport/command/LedgerStateCheckCommand';
import { Ledger } from '@hlf-explorer/common';

export class LedgerStateChecker extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected timer: any;
    protected timeout: number;
    protected isRunning: boolean;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, protected transport: Transport, protected ledger: Ledger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Handlers
    //
    // --------------------------------------------------------------------------

    private checkTimerHandler = (): void => {
        this.check();
    };

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected timerStart(timeout: number): void {
        if (this.isRunning) {
            return;
        }

        clearTimeout(this.timer);
        this.timer = setInterval(this.checkTimerHandler, timeout);

        this.timeout = timeout;
        this.isRunning = true;
        this.log(`Timer started ${timeout}ms`);
    }

    protected timerStop(): void {
        if (!this.isRunning) {
            return;
        }

        clearInterval(this.timer);
        this.timer = null;

        this.isRunning = false;
        this.log(`Timer stopped`);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async start(): Promise<void> {
        this.timerStart(this.ledger.blockFrequency);
        this.check();
    }

    public async check(): Promise<void> {
        this.transport.send(new LedgerStateCheckCommand(TraceUtil.addIfNeed({ ledgerId: this.ledger.id })), { timeout: this.timeout });
    }

    public stop(): void {
        this.timerStop();
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.stop();
    }
}
