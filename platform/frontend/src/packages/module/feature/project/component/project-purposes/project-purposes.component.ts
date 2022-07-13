import { Component, Input, ViewContainerRef } from '@angular/core';
import { ICdkTableCellEvent, ICdkTableSettings, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { ProjectBaseComponent } from '../ProjectBaseComponent';
import { ProjectPurposeMapCollection, ProjectPurposeTableSettings } from '@core/lib/project';
import { ProjectUser } from '@project/common/platform/project';
import { PipeService, UserService } from '@core/service';
import { Transport } from '@ts-core/common/transport';
import { Project, ProjectPurpose } from '@project/common/platform/project';
import { ProjectPurposeAddCommand } from '../../transport';
import { UserProject } from '@project/common/platform/user';

@Component({
    selector: 'project-purposes',
    templateUrl: 'project-purposes.component.html',
    providers: [ProjectPurposeMapCollection]
})
export class ProjectPurposesComponent extends ProjectBaseComponent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public settings: ICdkTableSettings<ProjectPurpose>;
    private _isEditable: boolean;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef,
        private pipe: PipeService,
        private user: UserService,
        private transport: Transport,
        public items: ProjectPurposeMapCollection
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected commitProjectProperties(): void {
        super.commitProjectProperties();
        this.commitSettingsProperties();

        this.items.project = this.project;
        this.items.reload();
    }

    protected commitIsEditableProperties(): void {
        this.commitSettingsProperties();
    }

    protected commitSettingsProperties(): void {
        this.settings = new ProjectPurposeTableSettings(this.isEditable, this.pipe);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async cellClickedHandler(item: ICdkTableCellEvent<ProjectPurpose>): Promise<void> {
        switch (item.column) {
            case (ProjectPurposeTableSettings.COLUMN_NAME_REMOVE):
                _.remove(this.project.purposes, item.data);
                this.items.reload();
                break;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async add(): Promise<void> {
        let item = await this.transport.sendListen(new ProjectPurposeAddCommand());
        this.project.purposes.push(item);
        this.items.reload();
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this.items)) {
            this.items.destroy();
            this.items = null;
        }

        this.settings = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get project(): UserProject {
        return super.project;
    }
    @Input()
    public set project(value: UserProject) {
        super.project = value;
    }

    public get isEditable(): boolean {
        return this._isEditable;
    }
    @Input()
    public set isEditable(value: boolean) {
        if (value === this._isEditable) {
            return;
        }
        this._isEditable = value;
        this.commitIsEditableProperties();
    }

}
