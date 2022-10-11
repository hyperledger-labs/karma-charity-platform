import { DynamicModule, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { LoggerModule } from '@ts-core/backend-nestjs';
import { CacheModule } from '@ts-core/backend-nestjs';
import { TransportModule, TransportType } from '@ts-core/backend-nestjs';
import MemoryStore from 'cache-manager-memory-store';
import { AppSettings } from './AppSettings';
import { DatabaseModule } from '@project/module/database';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger } from '@ts-core/common';
import { IDatabaseSettings } from '@ts-core/backend';
import { modulePath } from '@project/module';
import { AbstractService } from '@project/module/core/service';
import { UserModule } from '@project/module/user';
import { InitializeService } from './service';
import { CryptoModule } from '@project/module/crypto';
import { CoreModule } from '@project/module/core';
import { LoginModule } from '@project/module/login';
import { NalogModule } from '@project/module/nalog';
import { CompanyModule } from '@project/module/company';
import { FavoriteModule } from '@project/module/favorite';
import { ProjectModule } from '@project/module/project';
import { LedgerModule } from '@project/module/ledger';
import { CloudPaymentsModule } from '@project/module/cloud-payments';
import { FileModule } from '@project/module/file';
import { AutocompleteModule } from '@project/module/autocomplete';
import { StatisticsModule } from '@project/module/statistics';

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
                FileModule.forRoot({
                    bucketName: settings.s3FileBucketName,
                    accessKeyId: settings.s3AccessKeyId,
                    secretAccessKey: settings.s3SecretAccessKey
                }),
                LoginModule.forRoot(settings),
                CryptoModule.forRoot(settings),

                UserModule,
                NalogModule,
                LedgerModule,
                CompanyModule,
                ProjectModule,
                FavoriteModule,
                StatisticsModule,

                AutocompleteModule,
                CloudPaymentsModule,
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
                migrationsRun: true
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
                migrationsTableName: 'migrations_seed'
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


