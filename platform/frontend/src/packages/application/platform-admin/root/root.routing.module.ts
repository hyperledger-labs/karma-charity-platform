import { NgModule } from '@angular/core';
import { RouterModule, Routes, NoPreloading } from '@angular/router';
import { LanguageResolver, LoginResolver, LoginNotGuard, LoginIfCanGuard } from '@ts-core/angular';
import { RouterService } from '@core/service';

const routes: Routes = [
    {
        path: RouterService.LOGIN_URL,
        resolve: {
            language: LanguageResolver,
        },
        // canActivate: [LoginNotGuard],
        loadChildren: () => import('../pages/login/login-page.module').then(item => item.LoginPageModule)
    },
    {
        path: '',
        resolve: {
            login: LoginResolver,
            language: LanguageResolver
        },
        canActivate: [LoginIfCanGuard],
        loadChildren: () => import('../pages/shell/shell-page.module').then(item => item.ShellPageModule)
    }
];

@NgModule({
    // imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', preloadingStrategy: PreloadAllModules })],
    imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', preloadingStrategy: NoPreloading, enableTracing: false })],
    exports: [RouterModule]
})
export class RootRoutingModule { }
