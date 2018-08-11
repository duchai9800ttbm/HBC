import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { PackageSuccessComponent } from "./package-success.component";
import { PackageListComponent } from "./package-list/package-list.component";
import { ContractSignedComponent } from "./contract-signed/contract-signed.component";
import { MeetingKickoffComponent } from "./meeting-kickoff/meeting-kickoff.component";

const routes: Routes = [
    {
        path: '', component: PackageSuccessComponent,
        children: [
            { path: '', redirectTo: 'package-list'},
            { path: 'package-list', component: PackageListComponent},
            { path: 'contract-signed', component: ContractSignedComponent},
            { path: 'meeting-kickoff', component: MeetingKickoffComponent}
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageSuccessRoutingModule {}
