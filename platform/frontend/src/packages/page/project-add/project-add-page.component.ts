import { Component, ElementRef, ViewChild } from '@angular/core';
import { IRouterDeactivatable, ViewUtil } from '@ts-core/angular';
import { DestroyableContainer } from '@ts-core/common';
import { UrlTree } from '@angular/router';
import { ProjectAddComponent } from '../../module/feature/project/component';

@Component({
    templateUrl: './project-add-page.component.html'
})
export class ProjectAddPageComponent extends DestroyableContainer implements IRouterDeactivatable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @ViewChild('addContainer', { static: true })
    public addContainer: ProjectAddComponent;

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

    public async isCanDeactivate(): Promise<boolean> {
        return this.addContainer.isCanDeactivate();
    }

    public get isForceDeactivate(): boolean {
        return this.addContainer.isForceDeactivate;
    }
}
