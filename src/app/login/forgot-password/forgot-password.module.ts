import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { GetActiveCodeComponent } from './get-active-code/get-active-code.component';
import { EnterActiveCodeComponent } from './enter-active-code/enter-active-code.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    ForgotPasswordRoutingModule,
    SharedModule,
  ],
  declarations: [
    ForgotPasswordComponent,
    GetActiveCodeComponent,
    EnterActiveCodeComponent,
    ResetPasswordComponent]
})
export class ForgotPasswordModule { }
