import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryConditionComponent } from './summary-condition/summary-condition.component';
import { HsdtBuildComponent } from './hsdt-build.component';
import { HsktInvolvedComponent } from './hskt-involved/hskt-involved.component';
import { SummaryConditionFormComponent } from './summary-condition/summary-condition-form/summary-condition-form.component';
import { LiveformSiteReportComponent } from './liveform-site-report/liveform-site-report.component';
import { ChiPhiChungComponent } from './chi-phi-chung/chi-phi-chung.component';
import { RequirePriceComponent } from './require-price/require-price.component';
import { CauHoiHoSoComponent } from './cau-hoi-ho-so/cau-hoi-ho-so.component';
const routes: Routes = [
    {
        path: '',
        component: HsdtBuildComponent,
        children: [
            { path: '', redirectTo: 'summary' },
            {
                path: 'summary',
                loadChildren: './summary-condition/summary-condition.module#SummaryConditionModule'
            },
            { path: 'hskt', component: HsktInvolvedComponent },
            {
                path: 'liveformsite',
                loadChildren: './liveform-site-report/liveform-site-report.module#LiveformSiteReportModule'
            },
            {
                path: 'chiphichung',
                component: ChiPhiChungComponent
            },
            {
                path: 'baogiavattu',
                component: RequirePriceComponent
            },
            { path: 'cauhoi', component: CauHoiHoSoComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HsdtBuildRoutingModule { }
