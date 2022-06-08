import { FileItem, FileLikeObject, FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Observable, Subject, Subscription } from 'rxjs';
import { Loadable, LoadableEvent, LoadableStatus } from '@ts-core/common';
import { ObservableData } from '@ts-core/common/observer';
import * as _ from 'lodash';
import { ArrayUtil } from '@ts-core/common/util';
import { Base64File, Base64Source } from './base64';
import { filter, map } from 'rxjs/operators';
import { IUploaderFileCancel, IUploaderFileComplete, IUploaderFileError, IUploaderFileProgress, UploaderFile } from './UploaderFile';

export class Uploader<T = any> extends Loadable<UploaderEvent, UploaderEventData<T>> {
    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    protected subscription: Subscription;
    protected isInternalUploading: boolean = false;

    protected filesMap: Map<FileItem, UploaderFile<T>>;

    protected _files: Array<UploaderFile<T>>;
    protected _hasFiles: boolean;
    protected _uploader: FileUploader;
    protected _isAutoUpload: boolean = false;

    protected observer: Subject<ObservableData<UploaderEvent | LoadableEvent, any>>;

    public fileBuildForm: (file: UploaderFile<T>, formData: FormData) => void;
    public fileBeforeUpload: (file: UploaderFile<T>) => void;
    public fileUploadedData: (file: UploaderFile<T>, response: string, status: number, headers: ParsedResponseHeaders) => T;

    //--------------------------------------------------------------------------
    //
    //	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(url: string, isAutoUpload: boolean = true, maxFiles: number = NaN) {
        super();

        this.filesMap = new Map();

        this._files = new Array();
        this._hasFiles = false;
        this._isAutoUpload = isAutoUpload;

        let options = {} as FileUploaderOptions;
        options.url = url;
        options.autoUpload = isAutoUpload;

        if (!isNaN(maxFiles)) {
            options.queueLimit = maxFiles;
        }

        this._uploader = new FileUploader(options);
        this._uploader.onProgressAll = this.handleProgressAll;
        this._uploader.onCompleteAll = this.handleCompleteAll;
        this._uploader.onAfterAddingAll = this.handleAfterAddingAll;

        this._uploader.onErrorItem = this.handleItemError;
        this._uploader.onCancelItem = this.handleItemCancel;
        this._uploader.onSuccessItem = this.handleItemSuccess;
        this._uploader.onProgressItem = this.handleItemProgress;
        this._uploader.onCompleteItem = this.handleItemComplete;

        this._uploader.onBuildItemForm = this.handleItemBuildForm;
        this._uploader.onAfterAddingFile = this.handleItemAddingAfter;
        this._uploader.onBeforeUploadItem = this.handleItemBeforeUpload;
        this._uploader.onWhenAddingFileFailed = this.handleItemAddingFailed;
    }

    //--------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    //--------------------------------------------------------------------------

    protected commitStatusChangedProperties(oldStatus: LoadableStatus, newStatus: LoadableStatus): void {
        super.commitStatusChangedProperties(oldStatus, newStatus);
        console.log(oldStatus, '>', newStatus);
        switch (newStatus) {
            case LoadableStatus.LOADING:
                this.observer.next(new ObservableData(LoadableEvent.STARTED));
                break;
            case LoadableStatus.LOADED:
                this.observer.next(new ObservableData(LoadableEvent.FINISHED));
                break;
        }
    }

    protected fileGet(item: FileItem): UploaderFile<T> {
        return this.filesMap.get(item);
    }

    protected fileAdd(item: FileItem): UploaderFile<T> {
        let file = this.filesMap.get(item);
        if (_.isNil(file)) {
            file = new UploaderFile(item, this);
            this.filesMap.set(item, file);
            this._files.push(file);
            this._hasFiles = !_.isEmpty(this.files);
        }
        return file;
    }

    protected fileRemove(item: FileItem): UploaderFile<T> {
        let file = this.filesMap.get(item);
        if (!_.isNil(file)) {
            this.filesMap.delete(item);
            _.remove(this._files, file as any);
            this._hasFiles = !_.isEmpty(this.files);
        }
        return file;
    }

    //--------------------------------------------------------------------------
    //
    //  General Event Handlers
    //
    //--------------------------------------------------------------------------

    protected handleAfterAddingAll = (items: Array<FileItem>): void => {
        let files = _.compact(items.map(item => this.fileGet(item)));
        this.observer.next(new ObservableData(UploaderEvent.ADDED, files));
    };

    protected handleCompleteAll = (): void => {
        let isHasError = this.uploader.queue.some(item => item.isError);
        this.status = isHasError ? LoadableStatus.ERROR : LoadableStatus.LOADED;
        this.observer.next(new ObservableData(isHasError ? LoadableEvent.ERROR : LoadableEvent.COMPLETE, this._files));
    };

    protected handleProgressAll = (progress: number): void => {
        this.status = LoadableStatus.LOADING;
        this.observer.next(new ObservableData(UploaderEvent.PROGRESS, progress));
    };

    //--------------------------------------------------------------------------
    //
    //  File Event Handlers
    //
    //--------------------------------------------------------------------------

    protected handleItemAddingFailed = (item: FileLikeObject, filter: any, options: any): void => {
        this.observer.next(new ObservableData(UploaderEvent.FILE_ADDING_ERROR, { file: item, filter, options }));
    };

    protected handleItemAddingAfter = (item: FileItem): void => {
        let file = this.fileAdd(item);
        this.observer.next(new ObservableData(UploaderEvent.FILE_ADDED, { file }));
    };

    protected handleItemCancel = (item: FileItem, data: string): void => {
        // this.attachments.delete(item);
        let file = this.fileGet(item);
        this.observer.next(new ObservableData(UploaderEvent.FILE_CANCELED, { file, data }));
    };

    protected handleItemProgress = (item: FileItem, progress: number): void => {
        let file = this.fileGet(item);
        this.observer.next(new ObservableData(UploaderEvent.FILE_PROGRESS, { file, progress }));
    };

    protected handleItemSuccess = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void => {
        let file = this.fileGet(item);
        this.observer.next(new ObservableData(UploaderEvent.FILE_COMPLETE, { file, response, status, headers }));
    };

    protected handleItemComplete = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void => {
        // console.log('handleItemComplete', response);
    };

    protected handleItemError = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void => {
        let file = this.fileGet(item);
        let error = UploaderFile.createError(response, status, headers);
        this.observer.next(new ObservableData(UploaderEvent.FILE_ERROR, { file, response, status, headers, error }, error));
    };

    protected handleItemBeforeUpload = (item: FileItem): void => {
        let file = this.fileGet(item);
        if (!_.isNil(file) && !_.isNil(this.fileBeforeUpload)) {
            this.fileBeforeUpload(file);
        }
    };

    protected handleItemBuildForm = (item: FileItem, form: FormData): void => {
        let file = this.fileGet(item);
        if (!_.isNil(file) && !_.isNil(this.fileBuildForm)) {
            this.fileBuildForm(file, form);
        }
    };

    //--------------------------------------------------------------------------
    //
    //	Public Methods
    //
    //--------------------------------------------------------------------------

    public upload(item: UploaderFile<T>): void {
        this.uploader.uploadItem(item.file);
    }

    public cancel(file: UploaderFile<T>): void {
        file.file.cancel();
    }

    public remove(file: UploaderFile<T>): void {
        if (!this.isContains(file)) {
            return;
        }
        file.file.remove();
        _.remove(this._files, file as any);
        this._hasFiles = !_.isEmpty(this.files);
        if (!_.isNil(this.observer)) {
            this.observer.next(new ObservableData(UploaderEvent.FILE_REMOVED, { file }));
        }
        file.destroy();
    }

    public uploadAll(): void {
        this.uploader.uploadAll();
    }

    public cancelAll(): void {
        this.uploader.cancelAll();
    }

    public removeAll(): void {
        this.cancelAll();
        if (this.filesMap.size > 0) {
            this.filesMap.forEach(file => this.remove(file));
            this.filesMap.clear();
            ArrayUtil.clear(this._files);
            this._hasFiles = !_.isEmpty(this.files);
        }
        this.uploader.clearQueue();
    }

    public isContains(file: UploaderFile<T>): boolean {
        return this.uploader.getIndexOfItem(file.file) !== -1;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        if (!_.isNil(this.filesMap)) {
            this.removeAll();
            this.filesMap = null;
        }
        if (!_.isNil(this.uploader)) {
            this.uploader.destroy();
            this._uploader = null;
        }
        if (!_.isNil(this.observer)) {
            this.observer.complete();
            this.observer = null;
        }

        this._files = null;
        this._hasFiles = null;
        this.fileBuildForm = null;
        this.fileBeforeUpload = null;
    }

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    public get added(): Observable<Array<UploaderFile<T>>> {
        return this.events.pipe(
            filter(item => item.type === UploaderEvent.ADDED),
            map(item => (item.data as IFilesAdded<T>).files)
        );
    }
    public get progress(): Observable<number> {
        return this.events.pipe(
            filter(item => item.type === UploaderEvent.PROGRESS),
            map(item => (item.data as IFileProgress<T>).progress)
        );
    }
    public get fileAdded(): Observable<UploaderFile<T>> {
        return this.events.pipe(
            filter(item => item.type === UploaderEvent.FILE_ADDED),
            map(item => (item.data as IFileAdd<T>).file)
        );
    }
    public get fileAddingError(): Observable<IFileAddingError> {
        return this.events.pipe(
            filter(item => item.type === UploaderEvent.FILE_ADDING_ERROR),
            map(item => item.data as IFileAddingError)
        );
    }
    public get fileRemoved(): Observable<UploaderFile<T>> {
        return this.events.pipe(
            filter(item => item.type === UploaderEvent.FILE_REMOVED),
            map(item => (item.data as IFileRemove<T>).file)
        );
    }
    public get fileCanceled(): Observable<IFileCancel<T>> {
        return this.events.pipe(
            filter(item => item.type === UploaderEvent.FILE_CANCELED),
            map(item => item.data as IFileCancel<T>)
        );
    }
    public get fileProgress(): Observable<IFileProgress<T>> {
        return this.events.pipe(
            filter(item => item.type === UploaderEvent.FILE_PROGRESS),
            map(item => item.data as IFileProgress<T>)
        );
    }
    public get fileError(): Observable<IFileError<T>> {
        return this.events.pipe(
            filter(item => item.type === UploaderEvent.FILE_ERROR),
            map(item => item.data as IFileError<T>)
        );
    }
    public get fileComplete(): Observable<IFileComplete<T>> {
        return this.events.pipe(
            filter(item => item.type === UploaderEvent.FILE_COMPLETE),
            map(item => item.data as IFileComplete<T>)
        );
    }

    public get uploader(): FileUploader {
        return this._uploader;
    }

    public get files(): Array<UploaderFile<T>> {
        return this._files;
    }

    public get hasFiles(): boolean {
        return this._hasFiles;
    }

    public get isAutoUpload(): boolean {
        return this._isAutoUpload;
    }

    public get isUploading(): boolean {
        return this.isInternalUploading || this.uploader.isUploading;
    }

    public get options(): FileUploaderOptions {
        return this.uploader.options;
    }
}

export interface IFilesAdded<T> {
    files: Array<UploaderFile<T>>;
}
export interface IFileAddingError {
    file: FileLikeObject;
    filter: any;
    options: any;
}
export interface IFileContainer<T> {
    file: UploaderFile<T>;
}
export interface IFileAdd<T> extends IFileContainer<T> { }
export interface IFileRemove<T> extends IFileContainer<T> { }
export interface IFileError<T> extends IUploaderFileError, IFileContainer<T> { }
export interface IFileCancel<T> extends IUploaderFileCancel, IFileContainer<T> { }
export interface IFileComplete<T> extends IUploaderFileComplete, IFileContainer<T> { }
export interface IFileProgress<T> extends IUploaderFileProgress, IFileContainer<T> { }

export type UploaderEventData<T> =
    | IFilesAdded<T>
    | IFileAddingError
    | IFileAdd<T>
    | IFileRemove<T>
    | IFileError<T>
    | IFileCancel<T>
    | IFileComplete<T>
    | IFileProgress<T>;

export enum UploaderEvent {
    FILE_ADDED = 'FILE_ADDED',
    FILE_ADDING_ERROR = 'FILE_ADDING_ERROR',
    FILE_ERROR = 'FILE_ERROR',
    FILE_REMOVED = 'FILE_REMOVED',
    FILE_CANCELED = 'FILE_CANCELED',
    FILE_PROGRESS = 'FILE_PROGRESS',
    FILE_COMPLETE = 'FILE_COMPLETE',

    ADDED = 'ADDED',
    PROGRESS = 'PROGRESS',

    FILE_BASE64_ERROR = 'FILE_BASE64_ERROR',
    FILE_BASE64_COMPLETE = 'FILE_BASE64_COMPLETE'
}
