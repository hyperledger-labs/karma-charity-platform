import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsPageComponent } from './transactions-page.component';

const routes: Routes = [{ path: '', component: TransactionsPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class TransactionsPageRoutingModule { }
