import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchSelectionRoutingModule } from './branch-selection-routing.module';
import { BranchSelectionComponent } from './branch-selection.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        BranchSelectionRoutingModule,
    ],
    declarations: [
        BranchSelectionComponent,
    ]
})
export class BranchSelectionModule {}
