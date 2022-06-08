import { Loadable, LoadableEvent, LoadableStatus } from '@ts-core/common';
import { ExtendedError } from '@ts-core/common/error';
import { ObservableData } from '@ts-core/common/observer';
import { ObjectUtil, TransformUtil } from '@ts-core/common/util';
import { FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import * as _ from 'lodash';
import { Uploader } from './Uploader';

export class UploaderFile<T> extends Loadable<UploaderFileEvent, UploaderFileEventData> {
    //--------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    //--------------------------------------------------------------------------

    public static createError(response: string, status: number, headers: ParsedResponseHeaders): ExtendedError {
        let item: ExtendedError = null;
        if (ObjectUtil.isJSON(response)) {
            let data = JSON.parse(response);
            if (ExtendedError.instanceOf(data)) {
                item = TransformUtil.toClass(ExtendedError, data);
            }
        }
        if (_.isNil(item)) {
            item = ExtendedError.create(new Error(!_.isEmpty(response) ? response : 'Unknown file error'));
        }
        return item;
    }

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected _file: FileItem;
    protected _data: T;
    protected _uploader: Uploader;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(file: FileItem, uploader: Uploader) {
        super();
        this._file = file;
        this._uploader = uploader;
        this.file.onError = this.handleError;
        this.file.onCancel = this.handleCancel;
        this.file.onSuccess = this.handleSuccess;
        this.file.onProgress = this.handleProgress;
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    protected handleCancel = (response: string, status: number, headers: ParsedResponseHeaders): void => {
        // this.attachments.delete(item);
        this.status = LoadableStatus.NOT_LOADED;
        this.observer.next(new ObservableData(UploaderFileEvent.CANCELED, { response, status, headers }));
    };

    protected handleProgress = (progress: number): void => {
        this.status = LoadableStatus.LOADING;
        this.observer.next(new ObservableData(UploaderFileEvent.PROGRESS, { progress }));
    };

    protected handleSuccess = (response: string, status: number, headers: ParsedResponseHeaders): void => {
        if (!_.isNil(this.uploader.fileUploadedData)) {
            this._data = this.uploader.fileUploadedData(this, response, status, headers);
        }
        this.status = LoadableStatus.LOADED;
        this.observer.next(new ObservableData(LoadableEvent.COMPLETE, { status, response, headers }));
    };

    protected handleItemComplete = (response: string, status: number, headers: ParsedResponseHeaders): void => {
        // console.log('handleItemComplete', response);
    };

    protected handleError = (response: string, status: number, headers: ParsedResponseHeaders): void => {
        this.status = LoadableStatus.ERROR;
        this.observer.next(new ObservableData(LoadableEvent.ERROR, { error: UploaderFile.createError(response, status, headers), response, status, headers }));
    };

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public upload(): void {
        this.uploader.upload(this);
    }

    public cancel(): void {
        this.uploader.cancel(this);
    }

    public remove(): void {
        this.uploader.remove(this);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this._file = null;
        this._uploader = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get file(): FileItem {
        return this._file;
    }
    public get data(): T {
        return this._data;
    }
    public get uploader(): Uploader {
        return this._uploader;
    }
}

export type UploaderFileEventData = IUploaderFileError | IUploaderFileCancel | IUploaderFileComplete | IUploaderFileProgress;

export interface IUploaderFileError {
    error: ExtendedError;
    status: number;
    headers: ParsedResponseHeaders;
    response: string;
}

export interface IUploaderFileCancel {
    status: number;
    headers: ParsedResponseHeaders;
    response: string;
}

export interface IUploaderFileComplete {
    status: number;
    headers: ParsedResponseHeaders;
    response: string;
}

export interface IUploaderFileProgress {
    progress: number;
}

export enum UploaderFileEvent {
    PROGRESS = 'PROGRESS',
    CANCELED = 'CANCELED'
}
