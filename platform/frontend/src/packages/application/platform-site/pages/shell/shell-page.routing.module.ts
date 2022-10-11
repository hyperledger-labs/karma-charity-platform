import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouterService } from '@core/service';
import { ShellPageComponent } from './shell-page.component';
import { ProjectResolver } from '@feature/project/guard';

const routes: Routes = [
    {
        path: '',
        component: ShellPageComponent,
        children: [
            {
                path: '',
                redirectTo: RouterService.MAIN_URL
            },
            {
                path: RouterService.MAIN_URL,
                loadChildren: async () => (await import('../main/main-page.module')).MainPageModule
            },
            {
                path: RouterService.COMPANIES_URL,
                loadChildren: async () => (await import('../companies/companies-page.module')).CompaniesPageModule
            },
            {
                path: `${RouterService.PROJECT_URL}/:id`,
                loadChildren: async () => (await import('../project/project-page.module')).ProjectPageModule,
                resolve: { project: ProjectResolver },
            },
            { path: '**', redirectTo: '/' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShellPageRoutingModule { }
