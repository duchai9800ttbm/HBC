import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingReasonComponent } from './setting-reason/setting-reason.component';

const routes: Routes = [
  {
    path: '',
    component: SettingReasonComponent,
    children: [
      {
        path: '',
        redirectTo: 'win'
      },
      {
        path: 'lose',
        loadChildren: './setting-reason-lose/setting-reason-lose.module#SettingReasonLoseModule'
      },
      {
        path: 'reject',
        loadChildren: './setting-reason-reject/setting-reason-reject.module#SettingReasonRejectModule'
      },
      {
        path: 'win',
        loadChildren: './setting-reason-win/setting-reason-win.module#SettingReasonWinModule'
      }
    ]
    // redirectTo: 'lose',
    // pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingReasonRoutingModule { }
