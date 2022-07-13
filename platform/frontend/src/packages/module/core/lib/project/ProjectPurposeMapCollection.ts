import { CdkTableFilterableMapCollection, ICdkTableColumn, ICdkTableSettings } from '@ts-core/angular';
import * as _ from 'lodash';
import { PipeService } from '@core/service';
import { Injectable } from '@angular/core';
import { Project, ProjectPurpose } from '@project/common/platform/project';

@Injectable()
export class ProjectPurposeMapCollection extends CdkTableFilterableMapCollection<ProjectPurpose, Array<ProjectPurpose>> {

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private _project: Project;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(`id`);
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    private commitProjectProperties(): void {
        this.reload();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected isNeedClearAfterLoad(): boolean {
        return true;
    }

    protected request(): Promise<Array<ProjectPurpose>> {
        return Promise.resolve(this.project.purposes);
    }

    protected parseItem(item: ProjectPurpose): ProjectPurpose {
        return item;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.project = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get project(): Project {
        return this._project;
    }
    public set project(value: Project) {
        if (value === this._project) {
            return;
        }
        this._project = value;
        if (!_.isNil(value)) {
            this.commitProjectProperties();
        }
    }
}

export class ProjectPurposeTableSettings implements ICdkTableSettings<ProjectPurpose> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public isInteractive: boolean = false;

    public columns: Array<ICdkTableColumn<ProjectPurpose>>;
    public static COLUMN_NAME_REMOVE = 'menu';

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(isEditable: boolean, pipe: PipeService) {
        this.columns = [];
        this.columns.push({
            name: 'name',
            className: 'ps-3',
            headerClassName: 'ps-3',
            headerId: 'project.purpose.name',
            isDisableSort: true,
            format: item => item.name
        })
        this.columns.push({
            name: 'amount',
            headerId: 'payment.transaction.amount',
            isDisableSort: true,
            format: item => pipe.amount.transform(item)
        })
        if (isEditable) {
            this.columns.push({
                name: ProjectPurposeTableSettings.COLUMN_NAME_REMOVE,
                headerId: '',
                headerClassName: 'ps-3',
                className: 'ps-3 fas fa-minus-circle mouse-active text-danger',
                isDisableSort: true,
            });
        }

    }
}
