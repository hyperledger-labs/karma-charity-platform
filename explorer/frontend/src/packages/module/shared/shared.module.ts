import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VICommonModule, VIComponentModule } from '@ts-core/angular';
import { SearchContainerComponent } from './component/search-container/search-container.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const imports = [VICommonModule, VIComponentModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatTooltipModule];

const declarations = [
    SearchContainerComponent
];

@NgModule({
    imports: [CommonModule, ...imports],
    exports: [...imports, ...declarations, VICommonModule, VIComponentModule],
    declarations,
    providers
})
export class SharedModule { }
