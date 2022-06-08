import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VICommonModule, VIComponentModule } from '@ts-core/angular';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { UserTitlePipe, MaxLengthPipe, RolePipe, AccountPipe } from './pipe';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const imports = [VICommonModule, VIComponentModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatTooltipModule];

const declarations = [UserTitlePipe, MaxLengthPipe, RolePipe, AccountPipe];

@NgModule({
    imports: [CommonModule, ...imports],
    exports: [...imports, ...declarations, VICommonModule, VIComponentModule],
    declarations,
    providers
})
export class SharedModule { }
