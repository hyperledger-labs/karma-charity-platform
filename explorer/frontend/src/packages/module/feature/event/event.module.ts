import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { EventOpenHandler, EventsOpenHandler, } from './service';
import { TransportLazyModule } from '@ts-core/angular';
import { EventOpenCommand, EventsOpenCommand } from './transport';
import { Transport } from '@ts-core/common/transport';
import { EventComponent } from './component/event/event.component';
import { EventsComponent } from './component/events/events.component';
import { EventLastComponent } from './component/event-last/event-last.component';
import { EventDetailsComponent } from './component/event-details/event-details.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { EventsLastComponent } from './component/events-last/events-last.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [EventComponent, EventDetailsComponent, EventLastComponent, EventsComponent, EventsLastComponent];

@NgModule({
    imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatProgressBarModule ,MatTabsModule ,SharedModule],
    exports: declarations,
    declarations,
    providers
})
export class EventModule extends TransportLazyModule<EventModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'EventModule';
    public static COMMANDS = [EventOpenCommand.NAME, EventsOpenCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<EventModule>, transport: Transport, open: EventOpenHandler, opens: EventsOpenHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return EventModule.ID;
    }

    public get commands(): Array<string> {
        return EventModule.COMMANDS;
    }
}
