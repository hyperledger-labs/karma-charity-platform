import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { DestroyableContainer } from '@ts-core/common';
import { FileUploader } from 'ng2-file-upload';
import { Uploader } from '../../lib';

@Component({
    selector: 'file-select-button',
    templateUrl: 'file-select-button.component.html'
})
export class FileSelectButtonComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    @Input()
    public label: string;

    @Input()
    public disabled: boolean;

    public fileTypes: string;
    public fileUploader: FileUploader;

    private _uploader: Uploader;

    //--------------------------------------------------------------------------
    //
    //	Constructor
    //
    //--------------------------------------------------------------------------

    constructor() {
        super();
    }

    //--------------------------------------------------------------------------
    //
    //	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitUploaderProperties(): void {
        this.fileTypes = !_.isEmpty(this.uploader.options.allowedFileType) ? this.uploader.options.allowedFileType.join(',') : null;
        this.fileUploader = this.uploader.uploader;
    }

    //--------------------------------------------------------------------------
    //
    //	Public Methods
    //
    //--------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.uploader = null;
    }

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    @Input()
    public get uploader(): Uploader {
        return this._uploader;
    }
    public set uploader(value: Uploader) {
        if (value == this._uploader) {
            return;
        }
        this._uploader = value;
        if (this._uploader) {
            this.commitUploaderProperties();
        }
    }
}
