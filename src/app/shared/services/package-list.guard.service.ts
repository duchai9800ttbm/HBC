import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '../../../../node_modules/@angular/router';
import { SessionService } from './session.service';

@Injectable()
export class PackageListGuardService implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.sessionService.currentUserInfo) {
      //
      return true;
    }

    this.router.navigate(['/not-found'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
