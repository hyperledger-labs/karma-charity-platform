import { ApplicationRef, Injector, NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { APPLICATION_INJECTOR } from '@ts-core/angular';
import { CoreModule } from '../core.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root.routing.module';
import { MatButtonModule } from '@angular/material/button';
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

    constructor(private injector: Injector) { }

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
