"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const logger_1 = require("@ts-core/backend-nestjs/logger");
const cache_1 = require("@ts-core/backend-nestjs/cache");
const transport_1 = require("@ts-core/backend-nestjs/transport");
const cache_manager_memory_store_1 = require("cache-manager-memory-store");
const AppSettings_1 = require("./AppSettings");
const database_1 = require("@project/module/database");
const ledger_1 = require("@project/module/ledger");
const typeorm_1 = require("@nestjs/typeorm");
const transport_2 = require("@ts-core/common/transport");
const logger_2 = require("@ts-core/common/logger");
const module_1 = require("@project/module");
const core_1 = require("@project/module/core");
const healthcheck_1 = require("@project/module/healthcheck");
let AppModule = class AppModule extends core_1.AbstractService {
    transport;
    static forRoot(settings) {
        return {
            module: AppModule,
            imports: [
                database_1.DatabaseModule,
                logger_1.LoggerModule.forRoot(settings),
                cache_1.CacheModule.forRoot({ store: cache_manager_memory_store_1.default }),
                typeorm_1.TypeOrmModule.forRoot(this.getOrmConfig(settings)[0]),
                transport_1.TransportModule.forRoot({ type: transport_1.TransportType.LOCAL }),
                ledger_1.LedgerModule.forRoot(settings.ledgersSettingsPath),
                healthcheck_1.HealthcheckModule
            ],
            providers: [
                {
                    provide: AppSettings_1.AppSettings,
                    useValue: settings
                }
            ]
        };
    }
    static getOrmConfig(settings) {
        return [
            {
                type: 'postgres',
                host: settings.databaseHost,
                port: settings.databasePort,
                username: settings.databaseUserName,
                password: settings.databaseUserPassword,
                database: settings.databaseName,
                synchronize: false,
                logging: false,
                entities: [`${(0, module_1.modulePath)()}/database/**/*Entity.{ts,js}`,],
                migrations: [__dirname + '/migration/*.{ts,js}'],
                migrationsRun: false,
                cli: {
                    migrationsDir: 'src/migration',
                },
            },
            {
                type: 'postgres',
                host: settings.databaseHost,
                port: settings.databasePort,
                username: settings.databaseUserName,
                password: settings.databaseUserPassword,
                database: settings.databaseName,
                logging: false,
                entities: [
                    `${__dirname}/**/*Entity.{ts,js}`,
                    `${(0, module_1.modulePath)()}/database/**/*Entity.{ts,js}`
                ],
                migrations: [__dirname + '/migration/*.{ts,js}'],
                migrationsRun: true,
                cli: {
                    migrationsDir: 'src/migration'
                }
            },
            {
                name: 'seed',
                type: 'postgres',
                host: settings.databaseHost,
                port: settings.databasePort,
                username: settings.databaseUserName,
                password: settings.databaseUserPassword,
                database: settings.databaseName,
                synchronize: false,
                logging: false,
                entities: [
                    `${__dirname}/**/*Entity.{ts,js}`,
                    `${(0, module_1.modulePath)()}/database/**/*Entity.{ts,js}`
                ],
                migrations: [__dirname + '/seed/*.{ts,js}'],
                migrationsRun: true,
                migrationsTableName: 'migrations_seed',
                cli: {
                    migrationsDir: 'src/seed'
                }
            }
        ];
    }
    constructor(logger, settings, transport) {
        super('HLF Explorer API', settings, logger);
        this.transport = transport;
    }
    async onApplicationBootstrap() {
        await super.onApplicationBootstrap();
        if (this.settings.isTesting) {
            this.warn(`Service works in ${this.settings.mode}: some functions could work different way`);
        }
    }
};
AppModule = __decorate([
    __param(0, (0, common_1.Inject)(logger_2.Logger)),
    __metadata("design:paramtypes", [logger_2.Logger, AppSettings_1.AppSettings, transport_2.Transport])
], AppModule);
exports.AppModule = AppModule;
