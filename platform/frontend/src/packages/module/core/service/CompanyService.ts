import { Injectable } from '@angular/core';
import { LoginBaseServiceEvent } from '@ts-core/angular';
import { LoginService } from './LoginService';
import { TransformUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { Company } from '@project/common/platform/company';
import { Destroyable } from '@ts-core/common';
import { filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { ObservableData } from '@ts-core/common/observer';
import { UserCompany } from 'common/platform/user';

@Injectable({ providedIn: 'root' })
export class CompanyService extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _company: UserCompany;
    protected observer: Subject<ObservableData<CompanyServiceEvent, Company>>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private login: LoginService) {
        super();
        this.observer = new Subject();
        this.initialize();
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected initialize(): void {
        if (this.login.isLoggedIn) {
            this.loginedHandler();
        }

        this.login.events.pipe(takeUntil(this.destroyed)).subscribe(data => {
            if (data.type === LoginBaseServiceEvent.LOGIN_COMPLETE) {
                this.loginedHandler();
            } else if (data.type === LoginBaseServiceEvent.LOGOUT_FINISHED) {
                this.logoutedHandler();
            }
        });
    }

    protected commitCompanyProperties(): void {
        this.observer.next(new ObservableData(CompanyServiceEvent.CHANGED, this.company));
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    protected loginedHandler(): void {
        this.company = this.login.loginData.company;
    }

    protected logoutedHandler(): void {
        this.company = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public update(data: any): void {
        if (!this.hasCompany) {
            return;
        }
        Object.assign(this._company, data);
        this.observer.next(new ObservableData(CompanyServiceEvent.CHANGED, this.company));
    }

    public isCompany(value: Partial<Company> | number): boolean {
        if (_.isNil(value) || _.isNil(this.company)) {
            return false;
        }
        if (_.isNumber(value)) {
            return value === this.company.id;
        }
        return value.id === this.company.id;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this.observer)) {
            this.observer.complete();
            this.observer = null;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get events(): Observable<ObservableData<CompanyServiceEvent, Company>> {
        return this.observer.asObservable();
    }

    public get changed(): Observable<Company> {
        return this.events.pipe(
            filter(item => item.type === CompanyServiceEvent.CHANGED),
            map(item => item.data)
        );
    }

    public get hasCompany(): boolean {
        return !_.isNil(this.company);
    }

    public get id(): number {
        return this.hasCompany ? this.company.id : null;
    }
    public get company(): UserCompany {
        return this._company;
    }
    public set company(value: UserCompany) {
        if (value === this._company) {
            return;
        }
        this._company = value;
        if (!_.isNil(value)) {
            this._company = value;
            this.commitCompanyProperties();
        }
    }
}

export enum CompanyServiceEvent {
    CHANGED = 'CHANGED'
}

