import { Component, ElementRef, ViewChild } from '@angular/core';
import { IRouterDeactivatable, ViewUtil } from '@ts-core/angular';
import { DestroyableContainer } from '@ts-core/common';
import { UrlTree } from '@angular/router';
import { CompanyAddComponent } from '../../module/feature/company/component';

@Component({
    templateUrl: './company-add-page.component.html'
})
export class CompanyAddPageComponent extends DestroyableContainer implements IRouterDeactivatable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @ViewChild('addContainer', { static: true })
    public addContainer: CompanyAddComponent;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ElementRef) {
        super();
        ViewUtil.addClasses(container, 'd-block background border rounded');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async isCanDeactivate(): Promise<boolean | UrlTree> {
        return this.addContainer.isCanDeactivate();
    }

    public get isForceDeactivate(): boolean {
        return this.addContainer.isForceDeactivate;
    }
}
