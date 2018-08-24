import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrepareInterviewComponent } from './prepare-interview.component';
const routes: Routes = [
  {
    path: '',
    component: PrepareInterviewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrepareInterviewRoutingModule { }
