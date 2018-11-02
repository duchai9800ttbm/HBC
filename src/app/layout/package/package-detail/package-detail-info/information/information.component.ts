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
      return `http://demo.bys.vn/hbc/crm/#/customer/detail/${id}/overview`;
    }
    if (detail === 'lienHe') {
      return `http://demo.bys.vn/hbc/crm/#/contact/detail/${id}/overview`;
    }
    return null;
  }

  // rerender(result: any) {
  //   this.packageData = result.items;
  //   this.dtTrigger.next();
  // }
}
