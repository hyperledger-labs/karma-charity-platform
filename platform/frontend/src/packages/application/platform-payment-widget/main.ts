import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RootModule } from './root/root.module';

enableProdMode();
platformBrowserDynamic().bootstrapModule(RootModule);
