import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompaniesPageRoutingModule } from './companies-page.routing.module';
import { CompaniesPageComponent } from './companies-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../module/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatMenuModule, SharedModule, CompaniesPageRoutingModule],
    declarations: [CompaniesPageComponent]
})
export class CompaniesPageModule { }