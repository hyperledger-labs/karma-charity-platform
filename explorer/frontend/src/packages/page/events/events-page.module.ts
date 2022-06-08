import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EventsPageRoutingModule } from './events-page.routing.module';
import { EventsPageComponent } from './events-page.component';
import { MatButtonModule } from '@angular/material/button';
import { EventModule } from '@feature/event';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [CommonModule, MatButtonModule, SharedModule, EventsPageRoutingModule, EventModule],
    declarations: [EventsPageComponent]
})
export class EventsPageModule { }