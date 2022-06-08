import { Component, Input, ViewContainerRef } from '@angular/core';
import { ViewUtil, IWindowContent } from '@ts-core/angular';
import { TextHighlightUtil } from '@core/util';

@Component({
    selector: 'text-container',
    templateUrl: 'text-container.component.html'
})
export class TextContainerComponent extends IWindowContent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _text: string;
    public textHighlighted: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-flex flex-column');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitTextProperties(): void {
        let value = null;

        value = TextHighlightUtil.text(this.text);
        if (value !== this.textHighlighted) {
            this.textHighlighted = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public get text(): string {
        return this._text;
    }

    @Input()
    public set text(value: string) {
        if (value === this._text) {
            return;
        }
        this._text = value;
        if (this._text) {
            this.commitTextProperties();
        }
    }
}
