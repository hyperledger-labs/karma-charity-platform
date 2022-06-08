import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlocksPageComponent } from './blocks-page.component';

const routes: Routes = [{ path: '', component: BlocksPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class BlocksPageRoutingModule { }
