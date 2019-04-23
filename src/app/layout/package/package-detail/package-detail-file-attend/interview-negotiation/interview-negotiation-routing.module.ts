import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterviewNegotiationComponent } from './interview-negotiation.component';
import { SubmittedHsdtComponent } from './submitted-hsdt/submitted-hsdt.component';
const routes: Routes = [
  {
    path: '',
    component: InterviewNegotiationComponent,
    children: [
      { path: '', redirectTo: 'create' },
      {
        path: 'create',
        loadChildren: './create-interview/create-interview.module#CreateInterviewModule'
      },
      {
        path: 'prepare',
        loadChildren: './prepare-interview/prepare-interview.module#PrepareInterviewModule'
      },
      {
        path: 'end',
        loadChildren: './end-interview/end-interview.module#EndInterviewModule'
      },
      { path: 'submitted', component: SubmittedHsdtComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewNegotiationRoutingModule { }
