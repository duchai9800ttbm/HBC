import { NgModule } from '@angular/core';
import { InformationDeploymentComponent } from './information-deployment/information-deployment.component';
import { Routes, RouterModule } from '@angular/router';
import { PackageDetailFileAttendComponent } from './package-detail-file-attend.component';
import { PriceReviewComponent } from './price-review/price-review.component';
import { PriceReportSubmitedComponent } from './price-report-submited/price-report.component';
import { PriceReportCreateComponent } from './price-report-create/price-report-create.component';
import { HsdtPendingComponent } from './hsdt-pending/hsdt-pending.component';
import { HsdtSignedComponent } from './hsdt-signed/hsdt-signed.component';
import { HsdtSubmittedComponent } from './hsdt-submitted/hsdt-submitted.component';
const routes: Routes = [
    {
        path: '',
        component: PackageDetailFileAttendComponent,
        children: [
            // { path: '', redirectTo: 'create-request' },
            {
                path: 'infomation-deployment',
                loadChildren: './information-deployment/information-deployment.module#InformationDeploymentModule' },
            {
                path: 'build',
                loadChildren: './hsdt-build/hsdt-build.module#HsdtBuildModule'
            },
            { path: 'price-report', component: PriceReportSubmitedComponent },
            { path: 'price-report-create', component: PriceReportCreateComponent },
            { path: 'pending', component: HsdtPendingComponent },
            { path: 'signed', component: HsdtSignedComponent },
            { path: 'submited', component: HsdtSubmittedComponent },
            {
                path: 'interview-negotiation',
                loadChildren: './interview-negotiation/interview-negotiation.module#InterviewNegotiationModule'
            },
            {
                path: 'price-review',
                loadChildren: './price-review/price-review.module#PriceReviewModule'
            },
            {
                path: 'create-request',
                loadChildren: './need-create-tender/need-create-tender.module#NeedCreateTenderModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageDetailFileAttendRoutingModule { }
