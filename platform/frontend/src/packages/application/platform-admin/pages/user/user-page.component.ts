import { Component, ElementRef, ViewChild } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import { Transport } from '@ts-core/common/transport';
import { UserService } from '../../../../module/core/service';
import * as _ from 'lodash';
import { User } from 'common/platform/user';
import { UserMenu } from '../../../../module/feature/user/service';

@Component({
    templateUrl: 'user-page.component.html',
})
export class UserPageComponent extends DestroyableContainer {

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, private service: UserService) {
        super();
        ViewUtil.addClasses(element, 'd-flex scroll-vertical w-100 h-100');
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get user(): User {
        return this.service.user;
    }
}
