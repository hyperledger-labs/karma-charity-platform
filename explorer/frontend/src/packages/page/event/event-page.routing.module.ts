import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventPageComponent } from './event-page.component';

const routes: Routes = [{ path: '', component: EventPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class EventPageRoutingModule { }
