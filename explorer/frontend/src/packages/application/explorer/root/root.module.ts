import { ApplicationRef, Injector, NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { APPLICATION_INJECTOR } from '@ts-core/angular';
import { CoreModule } from '@core/core.module';
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root.routing.module';
import { LanguageService } from '@ts-core/frontend/language';
import { LanguageFileLoader } from '@ts-core/language/loader';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [RootComponent],
    imports: [CoreModule, RootRoutingModule, MatButtonModule, MatProgressBarModule]
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
