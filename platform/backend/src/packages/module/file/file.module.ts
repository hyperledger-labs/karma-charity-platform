import { DatabaseModule } from '@project/module/database';
import { DynamicModule } from '@nestjs/common';
import { SharedModule } from '@project/module/shared';
import { FileService } from './service';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController, FileListController, FileUploadTemporaryImageController, FileBase64UploadController, FileRemoveController } from './controller';
import { DatabaseService } from '@project/module/database/service';
import { YandexCloudStorage } from './service/storage';

export class FileModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: IFileSettings): DynamicModule {
        return {
            module: FileModule,
            global: true,
            imports: [
                SharedModule,
                DatabaseModule,
                MulterModule.registerAsync({
                    imports: [DatabaseModule],
                    inject: [DatabaseService],
                    useFactory: async (database: DatabaseService) => {
                        return {
                            limits: FileService.limits,
                            storage: new YandexCloudStorage(settings),
                            fileFilter: (request, file, callback) => FileService.uploadFilter(database, request, file, callback)
                        }
                    },
                }),
            ],
            providers: [
                FileService
            ],
            controllers: [FileUploadController, FileUploadTemporaryImageController, FileBase64UploadController, FileListController, FileRemoveController],
            exports: [FileService]
        };
    }
}

export interface IFileSettings {
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
}
