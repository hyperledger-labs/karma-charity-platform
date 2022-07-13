import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ICdkTableCellEvent, ICdkTableSettings, MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { ProjectBaseComponent } from '../ProjectBaseComponent';
import { ProjectUser } from '@project/common/platform/project/ProjectUser';
import { PipeService, UserService } from '@core/service';
import { Transport } from '@ts-core/common/transport';
import { Project, ProjectFileAllowExtensions, ProjectFileType } from '@project/common/platform/project';
import { FileMapCollection, FileTableSettings } from '@core/lib/file';
import { File, FileLinkType } from '@project/common/platform/file';
import { FileUploadCommand, FileOpenCommand } from '@feature/file/transport';
import { ProjectFileMenu } from '../../service';
import { UserProject } from '@project/common/platform/user';

@Component({
    selector: 'project-files',
    templateUrl: 'project-files.component.html',
    providers: [FileMapCollection]
})
export class ProjectFilesComponent extends ProjectBaseComponent {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;
    
    public settings: ICdkTableSettings<File>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef,
        private pipe: PipeService,
        private user: UserService,
        private transport: Transport,
        public items: FileMapCollection,
        public menu: ProjectFileMenu
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

        this.items.conditions.linkId = this.project.id;
        this.items.conditions.linkType = FileLinkType.PROJECT;
        this.settings = new FileTableSettings(this.pipe, this.user);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async cellClickedHandler(item: ICdkTableCellEvent<File>): Promise<void> {
        if (item.column !== FileTableSettings.COLUMN_NAME_MENU) {
            this.transport.send(new FileOpenCommand(item.data));
        }
        else {
            this.menu.refresh(this.project, item.data);
            this.trigger.openMenuOn(item.event.target);
        }
    }

    public async add(): Promise<void> {
        let isFileUploaded = await this.transport.sendListen(new FileUploadCommand({
            files: this.items.collection,
            types: Object.values(ProjectFileType),
            linkId: this.project.id,
            linkType: FileLinkType.PROJECT,
            allowExtensions: ProjectFileAllowExtensions
        }));
        if (isFileUploaded) {
            this.items.reload();
        }
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

}
