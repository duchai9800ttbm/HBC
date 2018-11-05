import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../../shared/services/permission.service';

@Component({
  selector: 'app-package-permission',
  templateUrl: './package-permission.component.html',
  styleUrls: ['./package-permission.component.scss'],
  animations: [routerTransition()]
})
export class PackagePermissionComponent implements OnInit {

  static packageId;
  packageId;
  isPermision = false;
  constructor(
    private activetedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activetedRoute.params.subscribe(result => {
      this.packageId = result.id;
      PackagePermissionComponent.packageId = this.packageId;
      this.permissionService.getUser().subscribe(data => {
        if ((data && data.userGroup && data.userGroup.text === 'Admin') ||
        (data && data.department && data.userGroup.text === 'Chủ trì') ||
        ((data && data.department && data.department.text === 'PHÒNG DỰ THẦU')
          && (data && data.level && data.level.text === 'Trưởng phòng'))) {
        this.isPermision = true;
      }
        if (!this.isPermision) {
          setTimeout(() => {
            this.router.navigate(['not-found']);
          }, 100);
        }
      });
    });
  }

}
