import { Component, Input, ViewContainerRef } from '@angular/core';
import { SelectListItem, SelectListItems, ViewUtil, WindowService } from '@ts-core/angular';
import { PipeService, UserService, CkeditorService } from '@core/service';
import * as _ from 'lodash';
import { ProjectPreferences, ProjectTag, ProjectStatus } from '@common/platform/project';
import { ISerializable } from '@ts-core/common';
import { IProjectEditDto } from '@common/platform/api/project';
import { ProjectBaseComponent } from '../ProjectBaseComponent';
import { UserProject } from '@project/common/platform/user';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import Editor from '@feature/ckeditor/script/ckeditor.js';

@Component({
    selector: 'project-edit',
    templateUrl: 'project-edit.component.html'
})
export class ProjectEditComponent extends ProjectBaseComponent implements ISerializable<IProjectEditDto> {
    //--------------------------------------------------------------------------
    //
    //  Constants
    //
    //--------------------------------------------------------------------------

    public static EVENT_SUBMITTED = 'EVENT_SUBMITTED';

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public tagsAll: SelectListItems<SelectListItem<ProjectTag>>;
    
    public status: ProjectStatus;
    public statuses: SelectListItems<SelectListItem<ProjectStatus>>;

    public descriptionEditor: any;
    public paymentAggregatorTypes: SelectListItems<SelectListItem<PaymentAggregatorType>>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        private pipe: PipeService,
        private user: UserService,
        private windows: WindowService,
        public ckeditor: CkeditorService,
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex flex-column');

        this.tagsAll = this.addDestroyable(new SelectListItems(pipe.language));
        Object.values(ProjectTag).forEach((item, index) => this.tagsAll.add(new SelectListItem(`project.tag.${item}`, index, item)));
        this.tagsAll.complete();

        this.statuses = this.addDestroyable(new SelectListItems(this.pipe.language));
        Object.values(ProjectStatus).forEach((item, index) => this.statuses.add(new SelectListItem(`project.status.${item}`, index, item)));
        this.statuses.complete();

        this.paymentAggregatorTypes = this.addDestroyable(new SelectListItems(this.pipe.language));
        Object.values(PaymentAggregatorType).forEach((item, index) => this.paymentAggregatorTypes.add(new SelectListItem(`payment.aggregator.type.${item}`, index, item)));
        this.paymentAggregatorTypes.complete();

        this.descriptionEditor = Editor;
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected commitProjectProperties(): void {
        super.commitProjectProperties();

        let value = null;

        value = this.project.status;
        if (value !== this.status) {
            this.status = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public async submit(): Promise<void> {
        await this.windows.question('project.action.save.confirmation').yesNotPromise;
        this.emit(ProjectEditComponent.EVENT_SUBMITTED);
    }

    public async geoSelect(): Promise<void> {
        /*
        let item = await this.transport.sendListen(new GeoSelectCommand(this.project.preferences.toGeo()), { timeout: DateUtil.MILISECONDS_DAY });
        this.location = item.location;
        this.latitude = item.latitude;
        this.longitude = item.longitude;
        */
    }

    public serialize(): IProjectEditDto {
        let preferences = { ...this.project.preferences } as Partial<ProjectPreferences>;
        let purposes = this.project.purposes;

        let item: IProjectEditDto = { id: this.project.id, preferences, purposes };
        if (this.isAdministrator) {
            item.status = this.status;
        }
        return item;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get isAdministrator(): boolean {
        return this.user.isAdministrator;
    }

    public get project(): UserProject {
        return super.project;
    }
    @Input()
    public set project(value: UserProject) {
        super.project = value;
    }
}
