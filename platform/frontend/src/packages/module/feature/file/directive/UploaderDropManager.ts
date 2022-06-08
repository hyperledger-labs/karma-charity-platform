import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { Uploader } from '../lib';
import * as _ from 'lodash';

export class UploaderDropManager extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    private element: HTMLElement;

    private _isOver: boolean = false;
    private _uploader: Uploader;
    private _className: string;

    //--------------------------------------------------------------------------
    //
    //	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: HTMLElement, className?: string) {
        super();
        this.element = element;
        this._className = className;
    }

    //--------------------------------------------------------------------------
    //
    //	Private Methods
    //
    //--------------------------------------------------------------------------

    protected toggleClass(): void {
        if (!_.isNil(this.className)) {
            ViewUtil.toggleClass(this.element, this.className, this.isOver);
        }
    }

    private stopEvent = (event: Event): void => {
        event.preventDefault();
        event.stopPropagation();
    };

    //--------------------------------------------------------------------------
    //
    //	Event Handlers
    //
    //--------------------------------------------------------------------------

    private dragDropHandler = (event: DragEvent): void => {
        this.stopEvent(event);
        this.isOver = false;

        let transfer = event.dataTransfer;
        if (_.isNil(transfer) || _.isEmpty(transfer.files)) {
            return;
        }
        let items = [];
        for (let i = 0; i < transfer.files.length; i++) {
            items.push(transfer.files[i]);
        }
        this.stopEvent(event);
        this.uploader.uploader.addToQueue(items, this.uploader.options);
    };

    private dragEnterHandler = (event: DragEvent): void => {
        this.stopEvent(event);
        this.isOver = true;
    };

    private dragOverHandler = (event: DragEvent): void => {
        event.dataTransfer.dropEffect = 'copy';
        this.stopEvent(event);
    };

    private dragLeaveHandler = (event: DragEvent) => {
        this.stopEvent(event);
        this.isOver = false;
    };

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    public get uploader(): Uploader {
        return this._uploader;
    }

    public set uploader(value: Uploader) {
        if (value == this._uploader) {
            return;
        }

        if (!_.isNil(this._uploader)) {
            this.element.removeEventListener('drop', this.dragDropHandler);
            this.element.removeEventListener('dragover', this.dragOverHandler);
            this.element.removeEventListener('dragenter', this.dragEnterHandler);
            this.element.removeEventListener('dragleave', this.dragLeaveHandler);
        }

        this._uploader = value;

        if (!_.isNil(this._uploader)) {
            this.element.addEventListener('drop', this.dragDropHandler);
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragenter', this.dragEnterHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
        }
    }

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    public get isOver(): boolean {
        return this._isOver;
    }
    public set isOver(value: boolean) {
        if (value === this._isOver) {
            return;
        }
        this._isOver = value;
        this.toggleClass();
    }

    public get className(): string {
        return this._className;
    }
    public set className(value: string) {
        if (value === this._className) {
            return;
        }
        this._className = value;
        this.toggleClass();
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
        this.element = null;
    }
}
