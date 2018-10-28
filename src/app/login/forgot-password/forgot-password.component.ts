import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  // animations: [routerTransition()],
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const browserName = this.getBrowser();
    if (browserName === 'Firefox') {
      document.getElementById('formLogin').classList.add('col-xl-12');
    }

  }

  getBrowser(): string {
    if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf('Safari') !== -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
      return 'Firefox';
    } else if ((navigator.userAgent.indexOf('MSIE') !== -1) || (!!(<any>document).documentMode === true)) {
      return 'IE';
    } else {
      return 'unknown';
    }
  }
}
