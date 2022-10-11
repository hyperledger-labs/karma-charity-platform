import { Component, ElementRef } from '@angular/core';
import { ISelectListItem, LoginGuard, NotificationService, SelectListItem, SelectListItems, ViewUtil } from '@ts-core/angular';
import { DestroyableContainer, LoadableEvent } from '@ts-core/common';
import { ActivatedRoute } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs';
import * as _ from 'lodash';
import { PipeService, RouterService } from '@core/service';
import { Transport } from '@ts-core/common';
import { Client } from '@project/common/platform/api';
import { Project } from '@project/common/platform/project';
import { ProjectPaymentTransactionMapCollection } from '@core/lib/project';
import { CoinEmitType } from '@project/common/transport/command/coin';

@Component({
    templateUrl: './project-page.component.html',
    styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _project: Project;

    public tabs: SelectListItems<ISelectListItem<string>>;
    public paymentTransactions: ProjectPaymentTransactionMapCollection;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ElementRef,
        route: ActivatedRoute,
        api: Client,

        private pipe: PipeService,
        private router: RouterService,
        private transport: Transport) {
        super();
        ViewUtil.addClasses(container, 'd-block');

        this.tabs = this.addDestroyable(new SelectListItems(pipe.language));
        this.tabs.add(new SelectListItem(`general.story`, 0, 'STORY'));
        this.tabs.add(new SelectListItem(`general.helped`, 1, 'PAYMENTS'));
        this.tabs.add(new SelectListItem(`general.publications`, 2, 'PUBLICATIONS'));
        this.tabs.complete(0);

        this.paymentTransactions = new ProjectPaymentTransactionMapCollection(api);

        this.tabs.changed.pipe(filter(item => item.data === 'PAYMENTS' && !this.paymentTransactions.isDirty), takeUntil(this.destroyed)).subscribe(() => this.paymentTransactions.reload());

        route.data.pipe(takeUntil(this.destroyed)).subscribe(data => this.project = data.project);
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private async commitProjectProperties(): Promise<void> {
        let item = _.find(this.tabs.collection, { data: 'PAYMENTS' });
        item.label = `${this.pipe.language.translate(item.translationId)} ${this.project.paymentsAmount}`;

        this.paymentTransactions.projectId = this.project.id;
        this.tabs.selectedData = 'PAYMENTS';
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public openMain(): void {
        this.router.navigate(RouterService.DEFAULT_URL);
    }

    public back(): void {
        let item = this.router.previousUrl;
        if (item === '/') {
            item = RouterService.DEFAULT_URL;
        }
        this.router.navigate(item);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        if (!_.isNil(this.paymentTransactions)) {

        }
        this.project = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get project(): Project {
        return this._project;
    }
    public set project(value: Project) {
        if (value === this._project) {
            return;
        }
        this._project = value;
        if (!_.isNil(value)) {
            this.commitProjectProperties();
        }
    }
}
