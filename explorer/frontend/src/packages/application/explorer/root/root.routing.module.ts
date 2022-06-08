import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, Routes, NoPreloading } from '@angular/router';
import { LanguageResolver, LoginRedirectResolver } from '@ts-core/angular';

const routes: Routes = [
    {
        path: '',
        resolve: { language: LanguageResolver },
        loadChildren: () => import('../pages/shell/shell-page.module').then(item => item.ShellPageModule)
    }
];

@NgModule({
    // imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', preloadingStrategy: PreloadAllModules })],
    imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', preloadingStrategy: NoPreloading, enableTracing: false })],
    exports: [RouterModule]
})
export class RootRoutingModule { }
