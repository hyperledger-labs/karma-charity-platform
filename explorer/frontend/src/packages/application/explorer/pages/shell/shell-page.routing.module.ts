import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouterService } from '@core/service';
import { BlockResolver } from '@feature/block/service';
import { EventResolver } from '@feature/event/service';
import { TransactionResolver } from '@feature/transaction/service';
import { ShellPageComponent } from './shell-page.component';

const routes: Routes = [
    {
        path: '',
        component: ShellPageComponent,
        children: [
            {
                path: '',
                loadChildren: async () => (await import('../main/main-page.module')).MainPageModule
            },
            {
                path: RouterService.BLOCKS_URL,
                loadChildren: async () => (await import('@page/blocks/blocks-page.module')).BlocksPageModule
            },
            {
                path: `${RouterService.BLOCK_URL}/:hashOrNumber`,
                resolve: { block: BlockResolver },
                loadChildren: async () => (await import('@page/block/block-page.module')).BlockPageModule
            },
            {
                path: RouterService.TRANSACTIONS_URL,
                loadChildren: async () => (await import('@page/transactions/transactions-page.module')).TransactionsPageModule
            },
            {
                path: `${RouterService.TRANSACTION_URL}/:hash`,
                resolve: { transaction: TransactionResolver },
                loadChildren: async () => (await import('@page/transaction/transaction-page.module')).TransactionPageModule
            },
            {
                path: RouterService.EVENTS_URL,
                loadChildren: async () => (await import('@page/events/events-page.module')).EventsPageModule
            },
            {
                path: `${RouterService.EVENT_URL}/:uid`,
                resolve: { event: EventResolver },
                loadChildren: async () => (await import('@page/event/event-page.module')).EventPageModule
            },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShellPageRoutingModule { }
