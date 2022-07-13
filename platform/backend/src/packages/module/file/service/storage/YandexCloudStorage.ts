
import { Request, Express } from 'express';
import { StorageEngine } from 'multer';
import * as _ from 'lodash';
import * as EasyYandexS3 from 'easy-yandex-s3';
import { FileService, IFile } from '../FileService';
import * as stream from 'stream';
import { File } from '@project/common/platform/file';


export class YandexCloudStorage implements StorageEngine {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected _bucket: any;
    protected _storage: any;
    protected _options: YandexCloudStorageOptions;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(options: YandexCloudStorageOptions) {
        this._options = options;
        this._storage = new EasyYandexS3({
            auth: {
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey
            },
            Bucket: options.bucketName,
            debug: false
        });
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    public _handleFile = (request: Request, file: Express.Multer.File, callback: Function) => {
        let name = FileService.nameInterceptor(request, file);
        let stream = file.stream;

        let buffer = Buffer.alloc(0);
        stream.on('data', (chunk) => buffer = Buffer.concat([buffer, chunk]))
            .on('error', (error) => callback(error, null))
            .on('end', async () => {
                try {
                    callback(null, await this.upload(buffer, name, '/doc/'));
                }
                catch (error) {
                    callback(error, null);
                }
            });
    }

    public _removeFile = (request, file, callback) => { };

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async upload(buffer: Buffer, name: string, directory: string): Promise<IFile> {
        let data = await this.storage.Upload({ buffer, name }, directory);
        return {
            name,
            uid: data.key,
            path: data.Location,
            size: buffer.length
        }
    }

    public async remove(file: File): Promise<boolean> {
        return this.storage.Remove(file.uid);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get bucket(): any {
        return this._bucket;
    }

    public get storage(): any {
        return this._storage;
    }

    public get options(): YandexCloudStorageOptions {
        return this._options;
    }
}

export interface YandexCloudStorageOptions {
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
}