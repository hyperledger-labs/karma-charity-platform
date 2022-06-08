import { Directive, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { Uploader } from '../lib';
import { UploaderDropManager } from './UploaderDropManager';
import * as _ from 'lodash';

@Directive({
    selector: '[vi-file-drop]'
})
export class UploaderDropDirective extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    private manager: UploaderDropManager;

    //--------------------------------------------------------------------------
    //
    //	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef) {
        super();
        this.manager = new UploaderDropManager(element.nativeElement);
    }

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    public get className(): string {
        return this.manager ? this.manager.className : null;
    }
    @Input()
    public set className(value: string) {
        if (!_.isNil(this.manager)) {
            this.manager.className = value;
        }
    }

    public get uploader(): Uploader {
        return this.manager ? this.manager.uploader : null;
    }
    @Input('vi-file-drop')
    public set uploader(value: Uploader) {
        if (!_.isNil(this.manager)) {
            this.manager.uploader = value;
        }
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
        if (!_.isNil(this.manager)) {
            this.manager.destroy();
            this.manager = null;
        }
    }
}
