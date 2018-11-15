import { Component, OnInit } from '@angular/core';
import { FakePackageData } from '../../../../../shared/fake-data/package-data';
import { ActivatedRoute } from '../../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { PackageModel } from '../../../../../shared/models/package/package.model';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageListItem } from '../../../../../shared/models/package/package-list-item';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { Subject } from '../../../../../../../node_modules/rxjs';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-package-detail-info',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  currentPackageId: number;
  package = new PackageInfoModel();
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  crm_site_domain = environment.crm_site_domain;

  constructor(
    private activatedRoute: ActivatedRoute,
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.spinner.show();
    this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
      this.package = result;
      // this.package.documentLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.package.documentLink);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }
  redirectToCRM(detail: string, id: number) {
    if (detail === 'tenKhachHang' || detail === 'donViTuVan') {
        return `${this.crm_site_domain}#/customer/detail/${id}/overview`;
    }
    if (detail === 'lienHe') {
        return `${this.crm_site_domain}#/contact/detail/${id}/overview`;
    }
    return null;
}

  // rerender(result: any) {
  //   this.packageData = result.items;
  //   this.dtTrigger.next();
  // }
}
