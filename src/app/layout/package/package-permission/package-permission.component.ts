import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../../shared/services/permission.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-package-permission',
  templateUrl: './package-permission.component.html',
  styleUrls: ['./package-permission.component.scss'],
  animations: [routerTransition()]
})
export class PackagePermissionComponent implements OnInit, OnDestroy {

  static packageId;
  packageId;
  isPermision = false;
  subscription: Subscription;
  constructor(
    private activetedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activetedRoute.params.subscribe(result => {
      this.packageId = result.id;
      PackagePermissionComponent.packageId = this.packageId;
      this.subscription = this.permissionService.getUser().subscribe(data => {
        if ((data && data.userGroup && data.userGroup.text === 'Admin') ||
          (data && data.department && data.userGroup.text === 'ChuTri') ||
          ((data && data.department && data.department.code === 'PDUTHAU')
            && (data && data.level && data.level.code === 'TRUONGPHONG'))) {
          this.isPermision = true;

        } else {
          //this.router.navigate(['not-found']);

        }
        if (!this.isPermision) {
          // setTimeout(() => {
          // }, 100);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
