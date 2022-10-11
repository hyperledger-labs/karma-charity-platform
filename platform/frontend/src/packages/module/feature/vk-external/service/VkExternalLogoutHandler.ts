import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { VkOpenApi } from "./VkOpenApi";
import { Transport, TransportCommandHandler } from "@ts-core/common";
import { VkExternalLogoutCommand } from "../transport";
import { Logger } from "@ts-core/common";

@Injectable({ providedIn: 'root' })
export class VkExternalLogoutHandler extends TransportCommandHandler<void, VkExternalLogoutCommand> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private api: VkOpenApi) {
        super(logger, transport, VkExternalLogoutCommand.NAME);
    }


    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    protected async execute(params: void): Promise<void> {        
        let api = await this.api.getApi();
        api.Auth.logout();
    }
}
