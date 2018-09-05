import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryConditionComponent } from './summary-condition/summary-condition.component';
import { HsdtBuildComponent } from './hsdt-build.component';
import { HsktInvolvedComponent } from './hskt-involved/hskt-involved.component';
import { SummaryConditionFormComponent } from './summary-condition/summary-condition-form/summary-condition-form.component';
import { LiveformSiteReportComponent } from './liveform-site-report/liveform-site-report.component';
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
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HsdtBuildRoutingModule { }
