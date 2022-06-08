import { DynamicModule, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { LoggerModule } from '@ts-core/backend-nestjs/logger';
import { CacheModule } from '@ts-core/backend-nestjs/cache';
import { TransportModule, TransportType } from '@ts-core/backend-nestjs/transport';
import MemoryStore from 'cache-manager-memory-store';
import { AppSettings } from './AppSettings';
import { DatabaseModule } from '@project/module/database';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ILogger, Logger } from '@ts-core/common/logger';
import { IDatabaseSettings } from '@ts-core/backend/settings';
import { modulePath } from '@project/module';
import { AbstractService } from '@project/module/core/service';
import { UserModule } from '@project/module/user';
import { InitializeService } from './service';
import { CryptoModule } from '@project/module/crypto';
import { CoreModule } from '@project/module/core';
import { LoginModule } from '@project/module/login';
import { NalogModule } from '@project/module/nalog';
import { CompanyModule } from '@project/module/company';
import { ProjectModule } from '@project/module/project';
import { CloudPaymentsModule } from '@project/module/cloud-payments';

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

                CacheModule.forRoot({ store: MemoryStore }),

                LoggerModule.forRoot(settings),
                TypeOrmModule.forRoot(this.getOrmConfig(settings)[0]),
                TransportModule.forRoot({ type: TransportType.LOCAL }),

                CoreModule.forRoot(settings),
                CryptoModule.forRoot(settings),
                LoginModule.forRoot(settings),
                
                UserModule,
                NalogModule,
                CompanyModule,
                ProjectModule,
                CloudPaymentsModule
            ],
            controllers: [
            ],
            providers: [
                {
                    provide: AppSettings,
                    useValue: settings
                },
                InitializeService,

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

    public constructor(@Inject(Logger) logger: Logger, settings: AppSettings, private service: InitializeService) {
        super('Karma Platform API', settings, logger);
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
        await this.service.initialize();
    }
}


