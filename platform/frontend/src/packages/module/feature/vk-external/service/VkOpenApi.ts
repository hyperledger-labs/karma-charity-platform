import { Destroyable } from "@ts-core/common";
import { SettingsService } from "@core/service";
import * as _ from 'lodash';
import { NativeWindowService, ScriptLoader } from "@ts-core/frontend";
import { Injectable } from "@angular/core";
import { takeUntil } from "rxjs";

@Injectable({ providedIn: 'root' })
export class VkOpenApi extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private script: ScriptLoader;

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    constructor(private nativeWindow: NativeWindowService, private settings: SettingsService) {
        super();
        this.script = new ScriptLoader('https://vk.com/js/api/openapi.js?169');
        this.script.completed.pipe(takeUntil(this.destroyed)).subscribe(async () => this.nativeWindow.window['VK'].init({ apiId: this.settings.vkSiteId }));
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async getApi(): Promise<any> {
        await this.script.load();
        return this.nativeWindow.window['VK'];
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        if (!_.isNil(this.script)) {
            this.script.destroy();
            this.script = null;
        }
    }

}