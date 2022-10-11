import { Destroyable } from "@ts-core/common";
import { SettingsService } from "@core/service";
import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { PromiseHandler } from "@ts-core/common";
import { ILoginDto, LoginData, LoginResource } from "@common/platform/api/login";
import { ExtendedError } from "@ts-core/common";
import { VkOpenApi } from "./VkOpenApi";
import { Transport, TransportCommandAsyncHandler } from "@ts-core/common";
import { VkExternalLoginCommand, VkExternalLogoutCommand } from "../transport";
import { Logger } from "@ts-core/common";
import { DateUtil } from "@ts-core/common";
import { VKUtil } from "../util";

@Injectable({ providedIn: 'root' })
export class VkExternalLoginHandler extends TransportCommandAsyncHandler<void, ILoginDto, VkExternalLoginCommand> {
    //--------------------------------------------------------------------------
    //
    // 	Constant
    //
    //--------------------------------------------------------------------------

    public static FIELDS = 'photo_200,bdate,sex,city,country,status,about';
    public static USER_METHOD = 'users.get';
    public static API_VERSION = '5.131';

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private settings: SettingsService, private api: VkOpenApi) {
        super(logger, transport, VkExternalLoginCommand.NAME);
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private getErrorMessage(data: any): string {
        if (_.isNil(data)) {
            return 'Response in nil';
        }
        if (data.hasOwnProperty('error')) {
            return data.error.error_msg;
        }
        return null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    private successHandler(data: any, user: any, promise: PromiseHandler<ILoginDto<LoginData>, ExtendedError>): void {
        promise.resolve({
            resource: LoginResource.VK_SITE,
            data: VKUtil.createUser(user, new URLSearchParams(data.session).toString())
        })
    }

    private errorHandler(error: string, promise: PromiseHandler<ILoginDto<LoginData>, ExtendedError>): void {
        promise.reject(new ExtendedError(error));
        this.transport.send(new VkExternalLogoutCommand());
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected async execute(params: void): Promise<ILoginDto<LoginData>> {
        let api = await this.api.getApi();
        let error = null;
        let promise = PromiseHandler.create<ILoginDto<LoginData>, ExtendedError>();

        console.log(this.settings.vkSiteId);
        api.init({ apiId: this.settings.vkSiteId });
        api.Auth.login(async data => {
            error = this.getErrorMessage(data);
            if (_.isNil(error) && _.isNil(data.session)) {
                error = !_.isNil(data.status) ? data.status : 'Undefined error';
            }
            if (!_.isNil(error)) {
                this.errorHandler(error, promise);
                return;
            }

            api.Api.call(VkExternalLoginHandler.USER_METHOD, {
                user_id: data.session.mid,
                fields: VkExternalLoginHandler.FIELDS,
                v: VkExternalLoginHandler.API_VERSION
            }, user => {
                error = this.getErrorMessage(user);
                if (_.isNil(error)) {
                    this.successHandler(data, user.response[0], promise);
                }
                else {
                    this.errorHandler(error, promise);
                }
            });
            PromiseHandler.delay(DateUtil.MILISECONDS_SECOND).then(() => this.successHandler(data, data.session.user, promise));
        });
        return promise.promise;
    }

}
