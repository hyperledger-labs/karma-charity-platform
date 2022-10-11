import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { RouterBaseService } from '@ts-core/angular';
import { NativeWindowService } from '@ts-core/frontend';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class RouterService extends RouterBaseService {

    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static MAIN_URL = 'main';
    public static LOGIN_URL = 'login';

    public static USER_URL = 'user';
    public static USERS_URL = 'users';

    public static COMPANY_URL = 'company';
    public static COMPANY_ADD_URL = 'companyAdd';
    public static COMPANIES_URL = 'companies';

    public static PROJECT_URL = 'project';
    public static PROJECTS_URL = 'projects';
    public static PROJECT_ADD_URL = 'projectAdd';
    public static PAYMENTS_URL = 'payments';

    public static MESSAGE_URL = 'message';
    public static DEFAULT_URL;

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _urlHash: URLSearchParams;
    private _urlOrigin: string;
    private _urlSearch: URLSearchParams;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(router: Router, nativeWindow: NativeWindowService) {
        super(router, nativeWindow);
        RouterService.DEFAULT_URL = '';

        this._urlHash = new URLSearchParams(nativeWindow.window.location.hash.substring(1));
        this._urlOrigin = nativeWindow.window.location.origin;
        this._urlSearch = new URLSearchParams(nativeWindow.window.location.search);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public get urlHash(): URLSearchParams {
        return this._urlHash;
    }

    public get urlOrigin(): string {
        return this._urlOrigin;
    }

    public get urlSearch(): URLSearchParams {
        return this._urlSearch;
    }
}

