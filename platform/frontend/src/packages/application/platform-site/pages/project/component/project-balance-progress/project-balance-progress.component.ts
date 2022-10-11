import { Component, Input, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { LanguageService } from '@ts-core/frontend';
import { UserProject } from '@project/common/platform/user';
import { DestroyableContainer, MathUtil } from '@ts-core/common';
import { LedgerCoinId } from '@project/common/ledger/coin';

@Component({
    selector: 'project-balance-progress',
    styleUrls: ['project-balance-progress.component.scss'],
    templateUrl: 'project-balance-progress.component.html',
})
export class ProjectBalanceProgressComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public progress: number = 0;
    private _project: UserProject;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(container: ViewContainerRef) {
        super();
        ViewUtil.addClasses(container, 'd-block');
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitProjectProperties(): void {
        let balance = this.project.balance;
        let currency = LedgerCoinId.RUB;
        if (!_.isNil(balance.collected) && !_.isNil(balance.required) && !_.isNil(balance.collected[currency]) && !_.isNil(balance.required[currency])) {
            let item = MathUtil.divide(balance.collected[currency], balance.required[currency]);
            this.progress = MathUtil.toNumber(MathUtil.multiply('100', item));
        }
        else {
            this.progress = 0;
        }
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
        this.project = null;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get project(): UserProject {
        return this._project;
    }
    @Input()
    public set project(value: UserProject) {
        if (value === this._project) {
            return;
        }
        this._project = value;
        if (!_.isNil(value)) {
            this.commitProjectProperties();
        }
    }
}
