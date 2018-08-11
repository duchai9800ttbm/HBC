import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { GetActiveCodeComponent } from './get-active-code/get-active-code.component';
import { EnterActiveCodeComponent } from './enter-active-code/enter-active-code.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
        { path: '', redirectTo: 'get-active-code'},
        { path: 'get-active-code', pathMatch: 'full', component: GetActiveCodeComponent },
        { path: 'enter-active-code' , component: EnterActiveCodeComponent  },
        { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ForgotPasswordRoutingModule {}
