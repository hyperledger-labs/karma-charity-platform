import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouterBaseService } from '@ts-core/angular';
import { NativeWindowService } from '@ts-core/frontend/service';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class RouterService extends RouterBaseService {

    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static LOGIN_URL = 'login';
    public static USER_URL = 'user';
    public static USERS_URL = 'users';

    public static COMPANY_URL = 'company';
    public static COMPANY_ADD_URL = 'companyAdd';
    public static COMPANIES_URL = 'companies';

    public static PROJECTS_URL = 'projects';
    public static PROJECT_ADD_URL = 'projectAdd';
    public static PAYMENTS_URL = 'payments';

    public static MESSAGE_URL = 'message';

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(router: Router, nativeWindow: NativeWindowService) {
        super(router, nativeWindow);
    }
}

