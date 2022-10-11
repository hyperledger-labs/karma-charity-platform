import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import * as _ from 'lodash';
import { RouterService } from '@core/service';
import { WindowService } from '@ts-core/angular';
import { Project } from '@common/platform/project';
import { Client } from '@common/platform/api';

@Injectable({ providedIn: 'root' })
export class ProjectResolver implements Resolve<Project> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private api: Client, private router: RouterService, private windows: WindowService) { }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Project> {
        console.log(123);
        
        let id = route.params.id;
        if (_.isNil(id)) {
            let message = 'error.projectIdNotFound';
            this.windows.info(message);
            this.router.navigate(RouterService.DEFAULT_URL);
            return Promise.reject(message);
        }

        try {
            return await this.api.projectGet(id);
        } catch (error) {
            this.router.navigate(RouterService.DEFAULT_URL);
            return Promise.reject(error.toString());
        }
    }
}