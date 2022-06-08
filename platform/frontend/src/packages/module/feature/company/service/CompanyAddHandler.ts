import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { RouterService } from '../../../core/service';
import { CompanyAddCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class CompanyAddHandler extends TransportCommandHandler<void, CompanyAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private router: RouterService) {
        super(logger, transport, CompanyAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        this.router.navigate(RouterService.COMPANY_ADD_URL);
    }

    /*
    protected async execute(): Promise<ICompanyAddDtoResponse> {
        let windowId = 'companyAdd';
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let config = new WindowConfig(true, false, 600);
        config.id = windowId;

        let promise = PromiseHandler.create<ICompanyAddDtoResponse>();
        let content = this.windows.open(CompanyAddComponent, config) as CompanyAddComponent;

        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case CompanyAddComponent.EVENT_SUBMITTED:
                    let item = this.company.company = await this.api.companyAdd(content.serialize());
                    this.notifications.info(`company.action.add.notification`);
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
    */
}
