import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainPageRoutingModule } from './main-page.routing.module';
import { MainPageComponent } from './main-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { BlockModule } from '@feature/block';
import { EventModule } from '@feature/event';
import { TransactionModule } from '@feature/transaction';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MatButtonModule,
        MainPageRoutingModule,
        BlockModule,
        EventModule,
        TransactionModule
    ],
    declarations: [MainPageComponent]
})
export class MainPageModule { }