import { Injectable } from '@angular/core';
import { WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { CompanyUserAddCommand, CompanyUserRoleEditCommand, ICompanyUserAddDto, ICompanyUserAddDtoResponse } from '../transport';
import { PromiseHandler } from '@ts-core/common/promise';
import { CompanyUserAddComponent } from '../component/company-user-add/company-user-add.component';
import { takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyUserAddHandler extends TransportCommandAsyncHandler<ICompanyUserAddDto, ICompanyUserAddDtoResponse, CompanyUserAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService) {
        super(logger, transport, CompanyUserAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICompanyUserAddDto): Promise<ICompanyUserAddDtoResponse> {
        let windowId = 'companyUserAdd' + params.companyId;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let config = new WindowConfig(false, false, 600);
        config.id = windowId;

        let promise = PromiseHandler.create<ICompanyUserAddDtoResponse>();
        let content = this.windows.open(CompanyUserAddComponent, config) as CompanyUserAddComponent;
        content.companyId = params.companyId;

        let isNeedRejectOnClose = true;
        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case CompanyUserAddComponent.EVENT_SUBMITTED:
                    isNeedRejectOnClose = false;
                    promise.resolve(await this.transport.sendListen(new CompanyUserRoleEditCommand({ companyId: params.companyId, userId: content.serialize() })));
                    content.close();
                    break;
                case WindowEvent.CLOSED:
                    if (isNeedRejectOnClose) {
                        promise.reject();
                    }
                    break;
            }
        });
        return promise.promise;
    }
}
