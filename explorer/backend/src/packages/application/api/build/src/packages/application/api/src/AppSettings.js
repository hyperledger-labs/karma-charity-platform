"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSettings = void 0;
const settings_1 = require("@ts-core/backend/settings");
const logger_1 = require("@ts-core/common/logger");
class AppSettings extends settings_1.EnvSettingsStorage {
    logger;
    get ledgersSettingsPath() {
        return this.getValue('LEDGERS_SETTINGS_PATH');
    }
    get databaseHost() {
        return this.getValue('POSTGRES_DB_HOST');
    }
    get databasePort() {
        return this.getValue('POSTGRES_DB_PORT', 5432);
    }
    get databaseName() {
        return this.getValue('POSTGRES_DB');
    }
    get databaseUserName() {
        return this.getValue('POSTGRES_USER');
    }
    get databaseUserPassword() {
        return this.getValue('POSTGRES_PASSWORD');
    }
    get webPort() {
        return this.getValue('WEB_PORT', 3001);
    }
    get webHost() {
        return this.getValue('WEB_HOST', 'localhost');
    }
    get loggerLevel() {
        return this.getValue('LOGGER_LEVEL', logger_1.LoggerLevel.ALL);
    }
}
exports.AppSettings = AppSettings;
