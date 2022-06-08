import { Component, Input, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { Project } from '@common/platform/project';
import { ProjectBaseComponent } from '../ProjectBaseComponent';
import { UserProject } from 'common/platform/user';

@Component({
    selector: 'project-details',
    templateUrl: 'project-details.component.html'
})
export class ProjectDetailsComponent extends ProjectBaseComponent {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef) {
        super(container);
        ViewUtil.addClasses(container, 'd-block');
    }

    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get project(): UserProject {
        return super.project;
    }
    @Input()
    public set project(value: UserProject) {
        super.project = value;
    }
}
