import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchSelectionComponent } from './branch-selection.component';

const routes: Routes = [
    {
        path: '', component: BranchSelectionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchSelectionRoutingModule {
}
