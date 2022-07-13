import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import * as _ from 'lodash';
import * as extname from 'ext-name';
import { Request, Express } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { diskStorage, memoryStorage, StorageEngine } from 'multer';
import { RandomUtil } from '@ts-core/common/util';
import { ExtendedError, UnreachableStatementError } from '@ts-core/common/error';
import { MULTER_MODULE_OPTIONS } from '@nestjs/platform-express/multer/files.constants';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { DatabaseService } from '@project/module/database/service';
import { IUserHolder } from '@project/module/database/user';
import { UserGuard } from '@project/module/guard';
import { LedgerCompanyRole, LedgerProjectRole } from '@project/common/ledger/role';
import { ProjectFileAllowExtensions } from '@project/common/platform/project';
import { FileLinkType } from '@project/common/platform/file';
import { YandexCloudStorage } from './storage';
import { CompanyFileAllowExtensions } from '@project/common/platform/company';

@Injectable()
export class FileService extends LoggerWrapper {
    //--------------------------------------------------------------------------
    //
    // 	Static
    //
    //--------------------------------------------------------------------------

    public static async uploadFilter(database: DatabaseService, request: Request & IUserHolder, file: Express.Multer.File, callback: Function): Promise<void> {
        try {
            let linkId = Number(request.body.linkId);
            if (_.isNaN(linkId)) {
                throw new ExtendedError('Invalid formData: "linkId" is required');
            }
            let linkType: FileLinkType = request.body.linkType;
            if (_.isNaN(linkType)) {
                throw new ExtendedError('Invalid formData: "linkType" is required');
            }
            let type = request.body.type;
            if (_.isNaN(type)) {
                throw new ExtendedError('Invalid formData: "type" is required');
            }

            let details = request.details = FileService.detailsGet(file.originalname);
            if (_.isEmpty(details.name)) {
                throw new ExtendedError('Invalid name: "originalname" is empty');
            }

            let item = await database.file.findOne({ linkId, linkType, type });
            if (!_.isNil(item)) {
                throw new ExtendedError('File already exists: remove before upload');
            }

            switch (linkType) {
                case FileLinkType.PROJECT:
                    if (!_.includes(ProjectFileAllowExtensions, details.extension)) {
                        throw new ExtendedError(`Invalid extension: only "${ProjectFileAllowExtensions.join(', ').trim()}" are allowed`);
                    }
                    let project = await database.projectGet(linkId, request.user);
                    UserGuard.checkProject({
                        isProjectRequired: true,
                        projectRole: [LedgerProjectRole.COIN_MANAGER, LedgerProjectRole.USER_MANAGER, LedgerProjectRole.PROJECT_MANAGER]
                    }, project);
                    break;
                case FileLinkType.COMPANY:
                    if (!_.includes(CompanyFileAllowExtensions, details.extension)) {
                        throw new ExtendedError(`Invalid extension: only "${CompanyFileAllowExtensions.join(', ').trim()}" are allowed`);
                    }
                    let company = await database.companyGet(linkId, request.user);
                    UserGuard.checkCompany({
                        isCompanyRequired: true,
                        companyRole: [LedgerCompanyRole.COIN_MANAGER, LedgerCompanyRole.USER_MANAGER, LedgerCompanyRole.PROJECT_MANAGER]
                    }, company);
                    break;
                default:
                    throw new UnreachableStatementError(linkType);
            }
            callback(null, true);
        } catch (error) {
            callback(ExtendedError.create(error), false);
        }
    }

    public static async uploadTemporaryImageFilter(request: Request & IUserHolder, file: Express.Multer.File, callback: Function): Promise<void> {
        try {
            let details = request.details = FileService.detailsGet(file.originalname);
            if (_.isEmpty(details.name)) {
                throw new ExtendedError('Invalid name: "originalname" is empty');
            }
            if (!_.includes(ProjectFileAllowExtensions, details.extension)) {
                throw new ExtendedError(`Invalid extension: only "${ProjectFileAllowExtensions.join(', ').trim()}" are allowed`);
            }
            callback(null, true);
        } catch (error) {
            callback(ExtendedError.create(error), false);
        }
    }

    public static nameInterceptor(request: Request, file: Express.Multer.File): string {
        let details = FileService.detailsGet(file.originalname);
        if (_.isEmpty(details.name) || _.isEmpty(details.extension)) {
            return file.originalname;
        }
        let randomName = RandomUtil.randomString(10);
        return `${details.name}_${randomName}.${details.extension}`;
    }

    public static detailsGet(name: string): IFileDetails {
        let [details] = extname(name);
        return { name: name.replace(`.${details.ext}`, ''), extension: details.ext, mime: details.mime };
    }

    public static get storageDisk(): StorageEngine {
        return diskStorage({
            destination: './files',
            filename: (request: Request, file: Express.Multer.File, callback: Function) => {
                callback(null, FileService.nameInterceptor(request, file))
            }
        });
    }

    public static get storageMemory(): StorageEngine {
        return memoryStorage();
    }

    public static get limits(): any {
        return {
            fieldNameSize: 100, // 100 bytes
            fieldSize: 1048576, // 1 Mb
            fileSize: 5242880, // 5 Mb
            files: 1,
        };
    }

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _storage: YandexCloudStorage;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(logger: Logger, @Inject(MULTER_MODULE_OPTIONS) options: MulterModuleOptions) {
        super(logger);
        this._storage = options.storage;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get storage(): YandexCloudStorage {
        return this._storage;
    }
}

export interface IFileRequest {
    details: IFileDetails;
}

export interface IFileDetails {
    mime: string;
    name: string;
    extension: string;
}

export interface IFile {
    uid: string;
    name: string;
    path: string;
    size: number;
}
