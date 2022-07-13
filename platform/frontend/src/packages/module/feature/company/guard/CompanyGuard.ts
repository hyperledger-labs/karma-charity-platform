import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import * as _ from 'lodash';
import { CompanyService } from '@core/service';

@Injectable({ providedIn: 'root' })
export class CompanyGuard implements CanActivate {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private company: CompanyService, private router: Router) { }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public canActivate(): boolean | UrlTree {
        return this.company.hasCompany ? true : this.router.parseUrl('/');
    }

}
