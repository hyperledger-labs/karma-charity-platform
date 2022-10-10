import { IModeSettings } from '@ts-core/backend/settings';
import { IDestroyable } from '@ts-core/common';
import { ILogger, LoggerWrapper } from '@ts-core/common/logger';
import * as _ from 'lodash';

export abstract class AbstractService extends LoggerWrapper implements IDestroyable {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected _name: string;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    protected constructor(name: string, protected settings: IModeSettings, logger?: ILogger) {
        super(logger);
        this._name = name;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async onApplicationBootstrap(): Promise<void> {
        let method = this.settings.isTesting ? this.warn : this.log;
        method.call(this, `"${this.name}" service started in ${this.settings.mode} mode`);
    }

    public destroy(): void {
        process.exit();
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get name(): string {
        return this._name;
    }
}
