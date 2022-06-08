import { Component, ViewContainerRef } from '@angular/core';
import { IWindowContent, ViewUtil, WindowService } from '@ts-core/angular';
import { LoginService } from '../../../../core/service';
import { ISerializable } from '@ts-core/common';
import { takeUntil } from 'rxjs';
import { FacebookLoginProvider, GoogleLoginProvider, VKLoginProvider } from '@abacritt/angularx-social-login';
import { LoginResource } from '@common/platform/api/login';

@Component({
    selector: 'login-container',
    templateUrl: 'login-container.component.html'
})
export class LoginContainerComponent extends IWindowContent implements ISerializable<boolean> {
    //--------------------------------------------------------------------------
    //
    //  Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ViewContainerRef, public service: LoginService, private windows: WindowService) {
        super(element);
        ViewUtil.addClasses(element.element, 'd-block');

        this.isDisabled = service.isLoading;
        service.logined.pipe(takeUntil(this.destroyed)).subscribe(() => this.close());
        service.started.pipe(takeUntil(this.destroyed)).subscribe(() => (this.isDisabled = true));
        service.finished.pipe(takeUntil(this.destroyed)).subscribe(() => (this.isDisabled = false));
    }

    //--------------------------------------------------------------------------
    //
    //  Private Methods
    //
    //--------------------------------------------------------------------------

    private async loginSocial(providerId: string, resource: LoginResource): Promise<void> {
        try {
            await this.service.loginSocial(providerId, resource);
        } catch (error: any) {
            this.windows.info(error.message);
        }
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public async vk(): Promise<void> {
        return this.loginSocial(VKLoginProvider.PROVIDER_ID, LoginResource.VK);
    }

    public async google(): Promise<void> {
        return this.loginSocial(GoogleLoginProvider.PROVIDER_ID, LoginResource.GOOGLE);
    }

    public async facebook(): Promise<void> {
        return this.loginSocial(FacebookLoginProvider.PROVIDER_ID, LoginResource.FACEBOOK);
    }

    public serialize(): boolean {
        return this.service.isLoggedIn;
    }
}
