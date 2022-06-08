import { Injectable } from '@angular/core';
import { RouterBaseService } from '@ts-core/angular';
import { SettingsBaseService } from '@ts-core/frontend/service';
import * as _ from 'lodash';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class SettingsService extends SettingsBaseService {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private router: RouterBaseService) {
        super();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async load(url: string = 'config.json'): Promise<void> {
        let { data } = await axios.get(url);
        this.initialize(data, this.router.getParams());
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get version(): string {
        return this.getValue('version');
    }

    public get explorerUrl(): string {
        return SettingsBaseService.parseUrl(this.getValue('explorerUrl'));
    }

    public get googleClientId(): string {
        return this.getValue('googleClientId');
    }
}
