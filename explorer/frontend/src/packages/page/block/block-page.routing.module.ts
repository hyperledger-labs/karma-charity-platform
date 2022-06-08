import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockPageComponent } from './block-page.component';

const routes: Routes = [{ path: '', component: BlockPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class BlockPageRoutingModule { }
