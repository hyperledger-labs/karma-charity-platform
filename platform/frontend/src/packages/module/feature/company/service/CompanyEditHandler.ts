import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { ICompanyEditDtoResponse } from '@project/common/platform/api/company';
import { UserUid, WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { PromiseHandler } from '@ts-core/common/promise';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs';
import { CompanyService } from '@core/service';
import { CompanyEditComponent } from '../component';
import { CompanyEditCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class CompanyEditHandler extends TransportCommandAsyncHandler<number, ICompanyEditDtoResponse, CompanyEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private api: Client, private company: CompanyService,) {
        super(logger, transport, CompanyEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: number): Promise<ICompanyEditDtoResponse> {
        let windowId = 'companyEdit' + params;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let item = await this.api.companyGet(params);

        let config = new WindowConfig(false, false, 600);
        config.id = windowId;

        let promise = PromiseHandler.create<ICompanyEditDtoResponse>();
        let content = this.windows.open(CompanyEditComponent, config) as CompanyEditComponent;
        content.company = item;

        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case CompanyEditComponent.EVENT_SUBMITTED:
                    content.isDisabled = true;
                    try {
                        let item = await this.api.companyEdit(content.serialize());
                        if (this.company.isCompany(item)) {
                            this.company.update(item);
                        }
                    }
                    finally {
                        content.isDisabled = false;
                    }

                    promise.resolve(item);
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
