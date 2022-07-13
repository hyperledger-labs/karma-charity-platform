import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { IRouterDeactivatable, SelectListItem, SelectListItems, ViewUtil, WindowService } from '@ts-core/angular';
import { LoginService, PipeService, SettingsService } from '@core/service';
import * as _ from 'lodash';
import { ISerializable } from '@ts-core/common';
import { Transport } from '@ts-core/common/transport';
import { Project, ProjectPreferences, ProjectTag } from '@project/common/platform/project';
import { Client } from '@project/common/platform/api';
import { ProjectBaseComponent } from '../ProjectBaseComponent';
import { IProjectAddDto } from '@project/common/platform/api/project';
import { UserProject } from '@project/common/platform/user';
import { ImageCropCommand } from '@feature/image-crop/transport';
import Editor from '@feature/ckeditor/script/ckeditor.js';
import { NgForm } from '@angular/forms';
import { ProjectOpenCommand } from '../../transport';
import { RouterService, CkeditorService } from '@core/service';

@Component({
    selector: 'project-add',
    templateUrl: 'project-add.component.html'
})
export class ProjectAddComponent extends ProjectBaseComponent implements IRouterDeactivatable, ISerializable<IProjectAddDto> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @ViewChild('form', { read: NgForm, static: false })
    private form: NgForm;

    @ViewChild('myEditor') myEditor: any;
    public tagsAll: SelectListItems<SelectListItem<ProjectTag>>;
    public descriptionEditor: any;
    public isForceDeactivate: boolean;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        pipe: PipeService,
        private transport: Transport,
        private api: Client,
        private router: RouterService,
        private windows: WindowService,
        public ckeditor: CkeditorService,
    ) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-flex flex-column');

        this.tagsAll = this.addDestroyable(new SelectListItems(pipe.language));
        Object.values(ProjectTag).forEach((item, index) => this.tagsAll.add(new SelectListItem(`project.tag.${item}`, index, item)));
        this.tagsAll.complete();

        this.project = new UserProject();
        this.project.purposes = [];
        this.project.preferences = new ProjectPreferences();
        this.project.preferences.description = '';

        this.descriptionEditor = Editor;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public async isCanDeactivate(): Promise<boolean> {
        if (!_.isNil(this.form) && !this.form.dirty) {
            return true;
        }
        await this.windows.question('project.add.exitConfirmation').yesNotPromise;
        this.isForceDeactivate = true;
        return true;
    }

    public async submit(): Promise<void> {
        await this.windows.question('project.action.save.confirmation').yesNotPromise;
        let item = await this.api.projectAdd(this.serialize());

        this.isForceDeactivate = true;
        this.transport.send(new ProjectOpenCommand(item.id));
        this.router.navigate(RouterService.COMPANY_URL);
    }

    public async pictureEdit(): Promise<void> {
        let item = await this.transport.sendListen(new ImageCropCommand({ imageBase64: this.project.preferences.picture }));
        this.project.preferences.picture = item.source;
    }

    public async geoSelect(): Promise<void> {
        /*
        let item = await this.transport.sendListen(new GeoSelectCommand(this.user.preferences.toGeo()), { timeout: DateUtil.MILISECONDS_DAY });
        this.location = item.location;
        this.latitude = item.latitude;
        this.longitude = item.longitude;
        */
    }

    public serialize(): IProjectAddDto {
        return {
            purposes: this.project.purposes,
            preferences: this.project.preferences
        }
    }

}
