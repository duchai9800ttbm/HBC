import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { SharedModule } from '../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
  imports: [
    LoginRoutingModule,
    SharedModule,
  ],
  declarations: [LoginComponent, LoginFormComponent]
})
export class LoginModule { }
