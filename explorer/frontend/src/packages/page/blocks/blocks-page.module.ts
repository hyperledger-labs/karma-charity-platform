import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlocksPageRoutingModule } from './blocks-page.routing.module';
import { BlocksPageComponent } from './blocks-page.component';
import { MatButtonModule } from '@angular/material/button';
import { BlockModule } from '@feature/block';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [CommonModule, MatButtonModule, SharedModule, BlocksPageRoutingModule, BlockModule],
    declarations: [BlocksPageComponent]
})
export class BlocksPageModule { }