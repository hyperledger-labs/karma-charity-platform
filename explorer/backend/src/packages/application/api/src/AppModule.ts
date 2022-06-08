import { DynamicModule, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { LoggerModule } from '@ts-core/backend-nestjs/logger';
import { CacheModule } from '@ts-core/backend-nestjs/cache';
import { TransportModule, TransportType } from '@ts-core/backend-nestjs/transport';
import MemoryStore from 'cache-manager-memory-store';
import { AppSettings } from './AppSettings';
import { DatabaseModule } from '@project/module/database';
import { LedgerModule } from '@project/module/ledger';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Transport } from '@ts-core/common/transport';
import { Logger } from '@ts-core/common/logger';
import { IDatabaseSettings } from '@ts-core/backend/settings';
import { modulePath } from '@project/module';
import { AbstractService } from '@project/module/core';
import { HealthcheckModule } from '@project/module/healthcheck';

export class AppModule extends AbstractService implements OnApplicationBootstrap {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: AppSettings): DynamicModule {
        return {
            module: AppModule,
            imports: [
                DatabaseModule,
                LoggerModule.forRoot(settings),

                CacheModule.forRoot({ store: MemoryStore }),
                TypeOrmModule.forRoot(this.getOrmConfig(settings)[0]),

                TransportModule.forRoot({ type: TransportType.LOCAL }),
                LedgerModule.forRoot(settings.ledgersSettingsPath),
                HealthcheckModule
            ],
            providers: [
                {
                    provide: AppSettings,
                    useValue: settings
                }
            ]
        };
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public static getOrmConfig(settings: IDatabaseSettings): Array<TypeOrmModuleOptions> {
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
                entities: [`${modulePath()}/database/**/*Entity.{ts,js}`,],
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
                    `${modulePath()}/database/**/*Entity.{ts,js}`
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
                    `${modulePath()}/database/**/*Entity.{ts,js}`
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

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    public constructor(@Inject(Logger) logger: Logger, settings: AppSettings, private transport: Transport) {
        super('HLF Explorer API', settings, logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async onApplicationBootstrap(): Promise<void> {
        await super.onApplicationBootstrap();
        if (this.settings.isTesting) {
            this.warn(`Service works in ${this.settings.mode}: some functions could work different way`);
        }
    }
}





