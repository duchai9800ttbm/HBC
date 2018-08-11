import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { routerTransition } from '../../../router.animations';
import { PackageModel } from '../../../shared/models/package/package.model';
import { FakePackageData } from '../../../shared/fake-data/package-data';
import { PackageService } from '../../../shared/services/package.service';
import { NgxSpinnerService } from '../../../../../node_modules/ngx-spinner';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.scss'],
  animations: [routerTransition()]

})
export class PackageDetailComponent implements OnInit {

  constructor(
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
  ) { }
  static packageId;
  public packageId: number;
  packageData = new PackageModel();
  status = {
    DisabledfileAttend: true,
    Disabledresult: true
  };
  ngOnInit() {
    this.activetedRoute.params.subscribe(result => {
      this.packageId = +result.id;
      PackageDetailComponent.packageId = this.packageId;
    });

    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.packageData = result;
    }, err => {
    });
  }

  get staticPackageId() {
    return PackageDetailComponent.packageId;
  }

  filePackageInvitation() {
    if (this.packageId) {
      this.router.navigate([`/package/detail/${this.packageId}/invitation`]);
    }
  }
  filePackageAttend() {
    if (this.packageId) {
      this.router.navigate([`/package/detail/${this.packageId}/invitation`]);
    }
  }
  packageInfo() {
    if (this.packageId) {
      this.router.navigate([`/package/detail/${this.packageId}/invitation`]);
    }
  }
  packageResult() {
    if (this.packageId) {
      this.router.navigate([`/package/detail/${this.packageId}/invitation`]);
    }
  }
}
