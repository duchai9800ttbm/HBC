import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableActionComponent } from './table-action.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [TableActionComponent],
    exports: [TableActionComponent]
})
export class TableActionModule {}
