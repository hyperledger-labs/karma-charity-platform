import { IDatabaseSettings, IWebSettings, EnvSettingsStorage } from '@ts-core/backend/settings';
import { ILogger, LoggerLevel } from '@ts-core/common/logger';
import { ICryptoSettings } from '@project/module/crypto/service';

export class AppSettings extends EnvSettingsStorage implements ICryptoSettings, IWebSettings, IDatabaseSettings {
    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public logger?: ILogger;

    // --------------------------------------------------------------------------
    //
    //  Public Database Properties
    //
    // --------------------------------------------------------------------------

    public get databaseUri(): string {
        return null;
    }

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
        return this.getValue('WEB_PORT');
    }

    public get webHost(): string {
        return this.getValue('WEB_HOST', 'localhost');
    }

    // --------------------------------------------------------------------------
    //
    //  Crypto Properties
    //
    // --------------------------------------------------------------------------

    public get databaseEncryptionNonce(): string {
        return this.getValue('DATABASE_ENCRYPTION_NONCE');
    }

    public get databaseEncryptionKey(): string {
        return this.getValue('DATABASE_ENCRYPTION_KEY');
    }

    // --------------------------------------------------------------------------
    //
    //  Explorer Properties
    //
    // --------------------------------------------------------------------------

    public get ledgerName(): string {
        return this.getValue('LEDGER_NAME');
    }

    public get hlfExplorerEndpoint(): string {
        return this.getValue('HLF_EXPLORER_ENDPOINT');
    }


    // --------------------------------------------------------------------------
    //
    //  JWT Properties
    //
    // --------------------------------------------------------------------------

    public get jwtSecret(): string {
        return this.getValue('JWT_SECRET');
    }

    public get jwtExpiresTimeout(): number {
        return this.getValue('JWT_EXPIRES_TIMEOUT', 3600);
    }

    // --------------------------------------------------------------------------
    //
    //  Google Properties
    //
    // --------------------------------------------------------------------------

    public get googleScope(): Array<string> {
        return this.getValue('GOOGLE_SCOPE', [])
            .toString()
            .split(',');
    }

    public get googleSecret(): string {
        return this.getValue('GOOGLE_SECRET');
    }

    public get googleClientId(): string {
        return this.getValue('GOOGLE_CLIENT_ID');
    }

    public get googleCallbackUrl(): string {
        return this.getValue('GOOGLE_CALLBACK_URL');
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
