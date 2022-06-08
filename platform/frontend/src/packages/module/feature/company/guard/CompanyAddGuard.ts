import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import * as _ from 'lodash';
import { CompanyService, UserService } from '../../../core/service';

@Injectable({ providedIn: 'root' })
export class CompanyAddGuard implements CanActivate {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private company: CompanyService, private user: UserService) { }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public canActivate(): boolean | UrlTree {
        return !this.company.hasCompany ? this.user.isCompanyManager : false;
    }
}
