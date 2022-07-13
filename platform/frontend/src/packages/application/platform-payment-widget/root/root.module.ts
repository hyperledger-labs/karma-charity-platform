import { ApplicationRef, Injector, NgModule } from '@angular/core';
import { RootComponent } from './root.component';
// import { RootComponent } from './root1.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [RootComponent],
    imports: [CommonModule, BrowserModule]
})
export class RootModule {

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public ngDoBootstrap(applicationRef: ApplicationRef): void {
        applicationRef.bootstrap(RootComponent);
    }
}
