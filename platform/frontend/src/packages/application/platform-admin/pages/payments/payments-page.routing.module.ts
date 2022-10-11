import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentsPageComponent } from './payments-page.component';

const routes: Routes = [{ path: '', component: PaymentsPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class PaymentsPageRoutingModule { }
