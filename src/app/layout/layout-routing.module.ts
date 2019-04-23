import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { ChangeListComponent } from './change-list/change-list.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'package' },
            { path: 'package', loadChildren: './package/package.module#PackageModule' },
            { path: 'management-user', loadChildren: './management-user/management-user.module#ManagementUserModule' },
            { path: 'user', loadChildren: './user/user.module#UserModule' },
            { path: 'notification-list', component: NotificationListComponent },
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
            { path: 'change-list', component: ChangeListComponent },
            { path: 'monitoring-report', loadChildren: './monitoring-report/monitoring-report.module#MonitoringReportModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
