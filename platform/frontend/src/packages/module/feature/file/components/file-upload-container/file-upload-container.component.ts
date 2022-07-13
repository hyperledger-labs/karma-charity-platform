import { Component, ViewContainerRef } from '@angular/core';
import { IWindowContent, NotificationService, ViewUtil, WindowService } from '@ts-core/angular';
import { ISerializable, LoadableEvent } from '@ts-core/common';
import { ObservableData } from '@ts-core/common/observer';
import * as _ from 'lodash';
import { Uploader, IFileAddingError, IFileError, UploaderEvent, UploaderEventData } from '../../lib';
import { takeUntil } from 'rxjs/operators';
import { File } from '@project/common/platform/file';
import { SettingsService, LoginService } from '@core/service';
import { FileMapCollection } from '@core/lib/file';
import { IFileUploadDto } from '../../transport';
import { FILE_URL } from '@project/common/platform/api';

@Component({
    templateUrl: 'file-upload-container.component.html'
})
export class FileUploadContainerComponent extends IWindowContent implements ISerializable {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private _items: Array<IFileItem>;
    private _isChanged: boolean;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        element: ViewContainerRef,
        private windows: WindowService,
        private settings: SettingsService,
        private notifications: NotificationService,
        private login: LoginService
    ) {
        super(element);
        ViewUtil.addClasses(element.element, 'd-flex flex-column');
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitUploadedProperties(): void { }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    private handleUploaderEvent = <T>(event: ObservableData<LoadableEvent | UploaderEvent, UploaderEventData<T>>): void => {
        switch (event.type) {
            case UploaderEvent.FILE_COMPLETE:
                this._isChanged = true;
                break;
            case UploaderEvent.FILE_ERROR:
                let data = event.data as IFileError<T>;
                this.notifications.info(`Unable to upload file ${data.file.file.file.name}: ${data.error.toString()}`);
                break;
            case UploaderEvent.FILE_ADDING_ERROR:
                let error = event.data as IFileAddingError;
                this.notifications.info(`Unable to add file ${error.file.name}: filter ${error.filter.name} failed`);
                break;
        }
    };

    protected handleFileErrorEvent<T>(data: IFileError<T>): void { }

    protected handleFileAddingErrorEvent(data: IFileAddingError): void { }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public initialize(params: IFileUploadDto): void {
        this._items = new Array();
        for (let type of params.types) {
            let file = _.find(params.files, { type });

            let uploader = new Uploader(`${this.settings.apiUrl}${FILE_URL}`, true, 1);
            uploader.options.allowedFileType = params.allowExtensions;
            uploader.fileBuildForm = (file, form) => {
                form.append('type', type);
                form.append('linkId', params.linkId.toString());
                form.append('linkType', params.linkType);
            };
            uploader.fileUploadedData = (file, response) => FileMapCollection.parseItem(JSON.parse(response));
            uploader.fileBeforeUpload = file => (file.file.withCredentials = false);
            uploader.uploader.authToken = `Bearer ${this.login.sid}`;
            uploader.events.pipe(takeUntil(this.destroyed)).subscribe(this.handleUploaderEvent);
            uploader.fileComplete.pipe(takeUntil(this.destroyed)).subscribe(file => (item.file = file.file.data));

            let item = { type, file, uploader };
            this._items.push(item);
        }
    }

    public serialize(): boolean {
        return this._isChanged;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get items(): Array<IFileItem> {
        return this._items;
    }
}

export interface IFileItem {
    file: File;
    type: string;
    uploader: Uploader<File>;
}
