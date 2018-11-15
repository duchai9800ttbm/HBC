import { Injectable } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { PackageService } from './package.service';

@Injectable()
export class ScrollToTopService {

  private _routerListener: Subscription;
  public isScrollTop = true;

  static _(router: Router) {
    return new ScrollToTopService(router);
  }

  constructor(
    private router: Router
    ) { }

  listen(): this {
    this._routerListener = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && this.isScrollTop) {
        console.log('scroll to top');
        window.scrollTo(0, 0);
      }
    });
    return this;
  }

  unlisten(): this {
    this._routerListener.unsubscribe();
    return this;
  }

}
