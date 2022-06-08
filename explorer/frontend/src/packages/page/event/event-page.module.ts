import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EventPageRoutingModule } from './event-page.routing.module';
import { EventPageComponent } from './event-page.component';
import { EventModule } from '@feature/event';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [CommonModule, SharedModule, EventPageRoutingModule, EventModule],
    declarations: [EventPageComponent]
})
export class EventPageModule {}