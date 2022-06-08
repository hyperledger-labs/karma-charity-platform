import { Component, Input, ViewContainerRef } from '@angular/core';
import { UploaderEvent, UploaderEventData, UploaderFile } from '../../lib';
import { ViewUtil } from '@ts-core/angular';
import { DestroyableContainer, LoadableEvent } from '@ts-core/common';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ObservableData } from '@ts-core/common/observer';
import { IUploaderFileComplete, IUploaderFileError, IUploaderFileProgress, IUploaderFileCancel, UploaderFileEventData } from '../../lib';
import { LanguageService } from '@ts-core/frontend/language';
import { IFileItem } from '../file-upload-container/file-upload-container.component';

@Component({
    selector: 'file-list-item',
    templateUrl: 'file-list-item.component.html'
})
export class FileListItemComponent<T> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _item: IFileItem;
    protected _progress: number = 0;

    private subscription: Subscription;

    public icon: string;
    public title: string = '';
    public progressLabel: string;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ViewContainerRef, private language: LanguageService) {
        super();
        ViewUtil.addClasses(element.element, 'd-block');
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitItemProperties(): void {
        let value = null;

        value = this.getIcon();
        if (value !== this.icon) {
            this.icon = value;
        }
    }

    protected commitProgressProperties(): void {
        let value = null;

        value = `${this.progress}%`;
        if (value !== this.progressLabel) {
            this.progressLabel = this.title = value;
        }
    }

    protected getIcon(): string {
        return 'fas fa-file';
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    private handleFileEvent = (event: ObservableData<LoadableEvent | UploaderEvent, any>): void => {
        // console.log(event);
        switch (event.type) {
            case UploaderEvent.FILE_ERROR:
                this.progress = 0;
                this.title = event.error.toString();
                // this.item.uploader.removeAll();
                break;
            case UploaderEvent.FILE_COMPLETE:
                this.progress = 100;
                this.title = this.language.translate(`file.status.loaded`);
                break;
            case UploaderEvent.PROGRESS:
                this.progress = event.data;
                break;
            case UploaderEvent.FILE_CANCELED:
                this.progress = 0;
                this.title = null;
                // this.item.uploader.removeAll();
                break;
        }
    };

    protected handleFileCompleteEvent(data: IUploaderFileComplete): void {}

    protected handleFileErrorEvent(data: IUploaderFileError): void {}

    protected handleFileProgressEvent(data: IUploaderFileProgress): void {}

    protected handleFileCancelEvent(data: IUploaderFileCancel): void {}

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public open(): void {
        //this.shell.operationFileOpen(this.item.file.id);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.item = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get progress(): number {
        return this._progress;
    }
    public set progress(value: number) {
        if (value === this._progress) {
            return;
        }
        this._progress = value;
        if (!_.isNil(value)) {
            this.commitProgressProperties();
        }
    }

    public get item(): IFileItem {
        return this._item;
    }
    @Input()
    public set item(value: IFileItem) {
        if (value === this._item) {
            return;
        }
        if (!_.isNil(this.subscription)) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this._item = value;
        if (!_.isNil(value)) {
            this.subscription = value.uploader.events.subscribe(this.handleFileEvent);
            this.commitItemProperties();
        }
    }
}
