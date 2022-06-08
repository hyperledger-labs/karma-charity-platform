import { Component, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { IWindowContent, MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { User } from '@common/platform/user';
import { UserMenu } from '../../service';

@Component({
    selector: 'user-container',
    templateUrl: 'user-container.component.html'
})
export class UserContainerComponent extends IWindowContent {

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;

    private _user: User;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef, public menu: UserMenu,) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex flex-column');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitUserProperties(): void {
        let value = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async menuOpen(event: MouseEvent): Promise<void> {
        this.menu.refresh(this.user);
        this.trigger.openMenuOn(event.target);
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.user = null;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get user(): User {
        return this._user;
    }
    @Input()
    public set user(value: User) {
        if (value === this._user) {
            return;
        }
        this._user = value;
        if (!_.isNil(value)) {
            this.commitUserProperties();
        }
    }
}
