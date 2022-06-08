import { Component, Input, ViewContainerRef } from '@angular/core';
import { Company } from '@project/common/platform/company';
import { UserCompany } from 'common/platform/user';
import { ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { CompanyBaseComponent } from '../CompanyBaseComponent';

@Component({
    selector: 'company-details',
    templateUrl: 'company-details.component.html'
})
export class CompanyDetailsComponent extends CompanyBaseComponent {
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
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get company(): UserCompany {
        return super.company;
    }
    @Input()
    public set company(value: UserCompany) {
        super.company = value;
    }
}
