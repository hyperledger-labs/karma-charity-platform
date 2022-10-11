import { Destroyable } from "@ts-core/common";
import { ScriptLoader } from "@ts-core/frontend";
import * as _ from 'lodash';
import { NativeWindowService } from "@ts-core/frontend";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class GoOpenApi extends Destroyable {
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

    constructor(private nativeWindow: NativeWindowService) {
        super();
        this.script = new ScriptLoader('https://accounts.google.com/gsi/client');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async getApi(): Promise<any> {
        await this.script.load();
        return this.nativeWindow.window['google'];
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