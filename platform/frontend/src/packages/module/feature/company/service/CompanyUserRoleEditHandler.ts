import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { NotificationService, WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { CompanyService } from '@core/service';
import { CompanyUserRoleEditCommand, ICompanyUserRoleEditDto, ICompanyUserRoleEditDtoResponse } from '../transport';
import { PromiseHandler } from '@ts-core/common/promise';
import { CompanyUserRoleEditComponent } from '../component/company-user-role-edit/company-user-role-edit.component';
import { takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyUserRoleEditHandler extends TransportCommandAsyncHandler<ICompanyUserRoleEditDto, ICompanyUserRoleEditDtoResponse, CompanyUserRoleEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, CompanyUserRoleEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICompanyUserRoleEditDto): Promise<ICompanyUserRoleEditDtoResponse> {
        let windowId = 'companyUserRoleEdit' + params.userId + params.companyId;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let roles = await this.api.companyUserRoleGet(params.companyId, params.userId);

        let config = new WindowConfig(false, false, 600);
        config.id = windowId;

        let promise = PromiseHandler.create<ICompanyUserRoleEditDtoResponse>();
        let content = this.windows.open(CompanyUserRoleEditComponent, config) as CompanyUserRoleEditComponent;
        content.roles = roles;

        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case CompanyUserRoleEditComponent.EVENT_SUBMITTED:
                    let item = await this.api.companyUserRoleSet(params.companyId, params.userId, content.serialize());
                    this.notifications.info(`user.action.roleEdit.notification`);
                    promise.resolve({ company: item });
                    content.close();

                    break;
                case WindowEvent.CLOSED:
                    promise.reject();
                    break;
            }
        });
        return promise.promise;
    }
}
