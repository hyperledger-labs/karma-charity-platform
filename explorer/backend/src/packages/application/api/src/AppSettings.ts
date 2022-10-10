import { IDatabaseSettings, IWebSettings, EnvSettingsStorage } from '@ts-core/backend/settings';
import { ILogger, LoggerLevel } from '@ts-core/common/logger';

export class AppSettings extends EnvSettingsStorage implements IWebSettings, IDatabaseSettings {
    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public logger?: ILogger;

    // --------------------------------------------------------------------------
    //
    //  Custom Properties
    //
    // --------------------------------------------------------------------------

    public get ledgersSettingsPath(): string {
        return this.getValue('LEDGERS_SETTINGS_PATH');
    }

    // --------------------------------------------------------------------------
    //
    //  Public Database Properties
    //
    // --------------------------------------------------------------------------

    public get databaseHost(): string {
        return this.getValue('POSTGRES_DB_HOST');
    }

    public get databasePort(): number {
        return this.getValue('POSTGRES_DB_PORT', 5432);
    }

    public get databaseName(): string {
        return this.getValue('POSTGRES_DB');
    }

    public get databaseUserName(): string {
        return this.getValue('POSTGRES_USER');
    }

    public get databaseUserPassword(): string {
        return this.getValue('POSTGRES_PASSWORD');
    }

    // --------------------------------------------------------------------------
    //
    //  Web Properties
    //
    // --------------------------------------------------------------------------

    public get webPort(): number {
        return this.getValue('WEB_PORT', 3001);
    }

    public get webHost(): string {
        return this.getValue('WEB_HOST', 'localhost');
    }

    // --------------------------------------------------------------------------
    //
    //  Logger Properties
    //
    // --------------------------------------------------------------------------

    public get loggerLevel(): LoggerLevel {
        return this.getValue('LOGGER_LEVEL', LoggerLevel.ALL);
    }
}
