import { ApplicationRef, Injector, NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { APPLICATION_INJECTOR } from '@ts-core/angular';
import { CoreModule } from '@core/core.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root.routing.module';
import { MatButtonModule } from '@angular/material/button';
import { LanguageService } from '@ts-core/frontend/language';
import { LanguageFileLoader } from '@ts-core/language/loader';
import { CommonModule } from '@angular/common';
import { PaymentModule } from '@feature/payment';

@NgModule({
    declarations: [RootComponent],
    imports: [CoreModule, CommonModule, RootRoutingModule, MatButtonModule, MatProgressBarModule, PaymentModule]
})
export class RootModule {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private injector: Injector, language: LanguageService) {
        let loader = language.loader;
        if (!(loader instanceof LanguageFileLoader)) {
            return;
        }
        loader.prefixes.push(
            'File.json',
            'User.json',
            'Role.json',
            'Login.json',
            'Wallet.json',
            'Profile.json',
            'Project.json',
            'Company.json',

            'Payment.json',
            'PaymentWidget.json',
        );
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public ngDoBootstrap(applicationRef: ApplicationRef): void {
        APPLICATION_INJECTOR(this.injector);
        applicationRef.bootstrap(RootComponent);
    }
}
