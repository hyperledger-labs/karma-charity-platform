import { Component, ViewContainerRef } from '@angular/core';
import { IWindowContent, ViewUtil, WindowService } from '@ts-core/angular';
import { LoginService } from '@core/service';
import { ISerializable } from '@ts-core/common';
import { takeUntil } from 'rxjs';
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

    private async loginSocial(resource: LoginResource): Promise<void> {
        try {
            await this.service.loginSocial(resource);
        } catch (error: any) {
            this.windows.info(error.message);
            this.shake();
        }
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public async vk(): Promise<void> {
        return this.loginSocial(LoginResource.VK_SITE);
    }

    public async google(): Promise<void> {
        return this.loginSocial(LoginResource.GOOGLE_SITE);
    }

    public serialize(): boolean {
        return this.service.isLoggedIn;
    }
}
