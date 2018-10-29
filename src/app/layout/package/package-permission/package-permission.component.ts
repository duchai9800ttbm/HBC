import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-package-permission',
  templateUrl: './package-permission.component.html',
  styleUrls: ['./package-permission.component.scss'],
  // animations: [routerTransition()]
})
export class PackagePermissionComponent implements OnInit {

  static packageId;
  packageId;
  constructor(
    private activetedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activetedRoute.params.subscribe(result => {
      this.packageId = result.id;
      PackagePermissionComponent.packageId = this.packageId;
    });
  }

}
