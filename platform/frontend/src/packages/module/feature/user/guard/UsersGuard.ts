import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import * as _ from 'lodash';
import { UserService, CompanyService } from '../../../core/service';

@Injectable({ providedIn: 'root' })
export class UsersGuard implements CanActivate {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private user: UserService, private company: CompanyService, private router: Router) { }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public canActivate(): boolean | UrlTree {
        if (this.user.isAdministrator) {
            return true;
        }
        if (this.user.isCompanyManager || this.user.isCompanyWorker) {
            return this.company.hasCompany ? true : this.router.parseUrl('/');
        }
        return this.router.parseUrl('/');
    }

}
