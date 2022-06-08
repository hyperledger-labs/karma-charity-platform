import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlockPageRoutingModule } from './block-page.routing.module';
import { BlockPageComponent } from './block-page.component';
import { MatButtonModule } from '@angular/material/button';
import { BlockModule } from '@feature/block';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [CommonModule, SharedModule, BlockPageRoutingModule, BlockModule],
    declarations: [BlockPageComponent]
})
export class BlockPageModule {}