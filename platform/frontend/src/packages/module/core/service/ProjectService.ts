import { Injectable } from '@angular/core';
import { ObjectUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { Destroyable } from '@ts-core/common';
import { Project } from '@project/common/platform/project';
import { CompanyService } from './CompanyService';

@Injectable({ providedIn: 'root' })
export class ProjectService extends Destroyable {

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private company: CompanyService) {
        super();
    }


    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public isCompanyProject(project: Project): boolean {
        if (!this.company.hasCompany) {
            return false;
        }
        return project.companyId === this.company.id;
    }

    public update(item: Project, params: Partial<Project>): void {
        if (_.isNil(item) || _.isNil(params)) {
            return;
        }
        ObjectUtil.copyPartial(params, item, null, ['preferences']);
        if (!_.isNil(params.preferences)) {
            ObjectUtil.copyPartial(params.preferences, item.preferences);
        }
    }
}

