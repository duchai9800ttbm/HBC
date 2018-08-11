import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        children: [
            { path: '', component: LoginFormComponent },
            { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
