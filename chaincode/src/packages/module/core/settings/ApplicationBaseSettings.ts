import { EnvSettingsStorage, ILoggerSettings } from '@ts-core/backend/settings';
import { ILogger, LoggerLevel } from '@ts-core/common/logger';

export class ApplicationBaseSettings extends EnvSettingsStorage implements ILoggerSettings {
    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public logger?: ILogger;

    // --------------------------------------------------------------------------
    //
    //  Logger Properties
    //
    // --------------------------------------------------------------------------

    public get loggerLevel(): LoggerLevel {
        return this.getValue('LOGGER_LEVEL', LoggerLevel.ALL);
    }
}
