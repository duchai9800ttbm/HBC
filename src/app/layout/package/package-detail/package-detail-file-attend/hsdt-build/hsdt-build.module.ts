import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HsdtBuildRoutingModule } from './hsdt-build-routing.module';
import { SummaryConditionComponent } from './summary-condition/summary-condition.component';
import { RequirePriceComponent } from './require-price/require-price.component';
import { HsdtBuildComponent } from './hsdt-build.component';
import { HsktInvolvedComponent } from './hskt-involved/hskt-involved.component';
import { SharedModule } from '../../../../../shared/shared.module';
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        HsdtBuildRoutingModule
    ],
    declarations: [
        HsdtBuildComponent,
        SummaryConditionComponent,
        RequirePriceComponent,
        HsktInvolvedComponent,
    ],
})
export class HsdtBuildModule { }
