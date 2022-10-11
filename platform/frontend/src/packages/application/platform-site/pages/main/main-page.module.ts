import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '@shared/shared.module';
import { MainPageComponent } from './main-page.component';
import { MainPageRoutingModule } from './main-page.routing.module';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatMenuModule, SharedModule, MainPageRoutingModule],
    declarations: [MainPageComponent]
})
export class MainPageModule { }