import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import * as _ from 'lodash';
import { CompanyService } from '@core/service';
import { CompanyUtil } from '@project/common/platform/company';

@Injectable({ providedIn: 'root' })
export class ProjectAddGuard implements CanActivate {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private company: CompanyService) { }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public canActivate(): boolean | UrlTree {
        return this.company.hasCompany ? CompanyUtil.isCanProjectAdd(this.company.company) : false;
    }
}
