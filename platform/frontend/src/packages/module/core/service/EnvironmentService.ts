import { Injectable } from '@angular/core';
import { NativeWindowService } from '@ts-core/frontend';
import { BottomSheetService, ViewUtil, WindowService, WindowServiceEvent } from '@ts-core/angular';
import { DestroyableContainer } from '@ts-core/common';
import { Transport } from '@ts-core/common';
// import { VkInternalLoginCommand } from '@feature/vk-internal/transport';
import * as _ from 'lodash';
import { filter, merge } from 'rxjs';
import { RouterService } from './RouterService';
import { ILoginDto } from '@project/common/platform/api/login';

@Injectable({ providedIn: 'root' })
export class EnvironmentService extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties 
    //
    //--------------------------------------------------------------------------

    private _mode: EnvironmentMode;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private transport: Transport, private router: RouterService, windows: WindowService, sheet: BottomSheetService,) {
        super();

        merge(windows.events, sheet.events).pipe(filter(event => event.type === WindowServiceEvent.OPEN_STARTED)).subscribe(event => {
            ViewUtil.addClass(event.data.container, `mode-${this.mode}`);
        });
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async check(): Promise<ILoginDto> {
        this._mode = EnvironmentMode.SITE;

        if (this.router.urlSearch.has('vk_app_id') && this.router.urlSearch.has('vk_user_id')) {
            this._mode = EnvironmentMode.VK;
            // return this.transport.sendListen(new VkInternalLoginCommand(this.router.urlSearch.toString()));
        }
        return null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get mode(): EnvironmentMode {
        return this._mode;
    }

    public get isVkMode(): boolean {
        return this.mode === EnvironmentMode.VK;
    }

    public get isSiteMode(): boolean {
        return this.mode === EnvironmentMode.SITE;
    }

}

export enum EnvironmentMode {
    SITE = 'SITE',
    VK = 'VK',
}
