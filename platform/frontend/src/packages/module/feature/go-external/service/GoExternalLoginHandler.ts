import { SettingsService } from "@core/service";
import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { PromiseHandler } from "@ts-core/common";
import { ExtendedError } from "@ts-core/common";
import { Transport, TransportCommandAsyncHandler } from "@ts-core/common";
import { GoExternalLoginCommand } from "../transport";
import { Logger } from "@ts-core/common";
import { GoOpenApi } from "./GoOpenApi";
import { ILoginDto, LoginData, LoginResource } from "@project/common/platform/api/login";

@Injectable({ providedIn: 'root' })
export class GoExternalLoginHandler extends TransportCommandAsyncHandler<void, ILoginDto, GoExternalLoginCommand> {

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private settings: SettingsService, private api: GoOpenApi) {
        super(logger, transport, GoExternalLoginCommand.NAME);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    protected async execute(params: void): Promise<ILoginDto<LoginData>> {
        let api = await this.api.getApi();
        let promise = PromiseHandler.create<ILoginDto<LoginData>, ExtendedError>();

        let client = api.accounts.oauth2.initCodeClient({
            client_id: this.settings.googleSiteId,
            scope: 'https://www.googleapis.com/auth/userinfo.profile',
            redirect_uri: this.settings.googleSiteRedirectUri,
            ux_mode: 'popup',
            callback: (response) => {
                promise.resolve({
                    resource: LoginResource.GOOGLE_SITE,
                    data: { token: response.code }
                })
            },
        });
        client.requestCode();
        return promise.promise;
    }

}
