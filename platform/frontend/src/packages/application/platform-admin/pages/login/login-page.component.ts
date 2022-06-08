import { Component, ElementRef } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { LoginGuard, LoginNotGuard, ViewUtil } from '@ts-core/angular';
import { LoginService, RouterService } from '../../../../module/core/service';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'login-page.component.html',
})
export class LoginPageComponent extends DestroyableContainer {

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        element: ElementRef,
        login: LoginService,
        router: RouterService,
    ) {
        super();
        ViewUtil.addClasses(element, 'd-flex justify-content-center align-items-center scroll-vertical w-100 h-100');
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------




}
