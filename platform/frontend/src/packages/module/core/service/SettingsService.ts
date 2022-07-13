import { Injectable } from '@angular/core';
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

    constructor() {
        super();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async load(url: string = 'config.json', routerParams?: any): Promise<void> {
        let { data } = await axios.get(url);
        this.initialize(data, routerParams);
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

    public get googleSiteId(): string {
        return this.getValue('googleSiteId');
    }

    public get googleSiteRedirectUri(): string {
        return this.getValue('googleSiteRedirectUri');
    }
}
