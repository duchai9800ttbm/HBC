import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HsdtBuildRoutingModule } from './hsdt-build-routing.module';
import { RequirePriceComponent } from './require-price/require-price.component';
import { HsdtBuildComponent } from './hsdt-build.component';
import { HsktInvolvedComponent } from './hskt-involved/hskt-involved.component';

@NgModule({
    imports: [
        CommonModule,
        HsdtBuildRoutingModule
    ],
    declarations: [
        HsdtBuildComponent,
        RequirePriceComponent,
        HsktInvolvedComponent,
    ]
})
export class HsdtBuildModule { }
