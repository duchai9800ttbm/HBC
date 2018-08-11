import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lose',
    pathMatch: 'full'
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingReasonRoutingModule { }
