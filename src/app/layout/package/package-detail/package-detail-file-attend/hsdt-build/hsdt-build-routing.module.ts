import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryConditionComponent } from './summary-condition/summary-condition.component';
import { HsdtBuildComponent } from './hsdt-build.component';

const routes: Routes = [
    {
        path: '', component: HsdtBuildComponent, children: [
            {
                path: '', redirectTo: 'summary'
            },
            {
                path: 'summary',
                component: SummaryConditionComponent
            }

        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HsdtBuildRoutingModule { }
