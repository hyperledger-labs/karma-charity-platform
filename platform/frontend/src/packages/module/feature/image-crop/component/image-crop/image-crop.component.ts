import { Component, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';
import { IWindowContent, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Uploader, UploaderFile } from '@feature/file/lib';
import { takeUntil } from 'rxjs';
import { ISerializable } from '@ts-core/common';
import { Base64Source } from '../../../file/lib/base64';

@Component({
    selector: 'image-crop',
    templateUrl: 'image-crop.component.html',
})
export class ImageCropComponent extends IWindowContent implements ISerializable<string> {
    //--------------------------------------------------------------------------
    //
    //  Constants
    //
    //--------------------------------------------------------------------------

    public static EVENT_SUBMITTED = 'EVENT_SUBMITTED';

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public uploader: Uploader;

    private _file: UploaderFile<void>;
    private _imageBase64: string;

    @Input()
    public imageTransform: ImageTransform = { scale: 1, rotate: 0, flipH: false, flipV: false };

    @Output()
    public imageBase64Changed: EventEmitter<string> = new EventEmitter();

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ViewContainerRef) {
        super(element);
        ViewUtil.addClasses(element.element, 'd-flex flex-column');

        this.uploader = this.addDestroyable(new Uploader(null, false, 1));
        this.uploader.fileAdded.pipe(takeUntil(this.destroyed)).subscribe(data => this.file = data);
        this.uploader.fileRemoved.pipe(takeUntil(this.destroyed)).subscribe(() => this.file = null);
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    private commitFileProperties(): void {
        if (_.isNil(this.file)) {
            this.imageBase64 = null;
        }
    }

    private commitBase64Properties(): void {
        if (this.imageBase64Changed) {
            this.imageBase64Changed.emit(this.imageBase64);
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public imageCropped(event: ImageCroppedEvent): void {
        this.imageBase64 = event.base64;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public transformUpdate(param: string, delta: number): void {
        let item = { ...this.imageTransform };
        item[param] = item[param] + delta;
        this.imageTransform = item;
    }

    public submit(): void {
        this.emit(ImageCropComponent.EVENT_SUBMITTED);
    }

    public serialize(): string {
        return this.imageBase64;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.file = null;
        this.imageTransform = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get file(): UploaderFile<void> {
        return this._file;
    }
    public set file(value: UploaderFile<void>) {
        if (value === this._file) {
            return;
        }
        this._file = value;
        this.commitFileProperties();
    }

    public get imageBase64(): string {
        return this._imageBase64;
    }
    public set imageBase64(value: string) {
        if (value === this._imageBase64) {
            return;
        }
        this._imageBase64 = value;
        this.commitBase64Properties();
    }
}
