import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { GoOpenApi } from "./GoOpenApi";
import { Transport, TransportCommandHandler } from "@ts-core/common/transport";
import { GoExternalLogoutCommand } from "../transport";
import { Logger } from "@ts-core/common/logger";

@Injectable({ providedIn: 'root' })
export class GoExternalLogoutHandler extends TransportCommandHandler<void, GoExternalLogoutCommand> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private api: GoOpenApi) {
        super(logger, transport, GoExternalLogoutCommand.NAME);
    }


    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    protected async execute(params: void): Promise<void> {
        let api = await this.api.getApi();
    }
}
