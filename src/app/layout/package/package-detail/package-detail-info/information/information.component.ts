import { Component, OnInit } from '@angular/core';
import { PackageDetailComponent } from '../../package-detail.component';
import { PackageService } from '../../../../../shared/services/package.service';
import { Subject } from '../../../../../../../node_modules/rxjs';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { environment } from '../../../../../../environments/environment';
import { AlertService, SessionService } from '../../../../../shared/services';
import { AdministeredPackageList } from '../../../../../shared/constants/administered-package';
import { Router } from '@angular/router';

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
  listPrivileges = [];
  administeredPackageList = AdministeredPackageList;
  isEditBidOpportunity;
  isViewBidOpportunityDetail;
  constructor(
    private packageService: PackageService,
    private alertService: AlertService,
    private sessionService: SessionService,
    private router: Router
  ) { }
  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.listPrivileges = this.sessionService.userInfo && this.sessionService.userInfo.privileges;
    if (this.listPrivileges) {
      this.isEditBidOpportunity = this.listPrivileges.some(x => x === 'EditBidOpportunity');
      this.isViewBidOpportunityDetail = this.listPrivileges.some(x => x === 'ViewBidOpportunityDetail');
      if (!(this.isViewBidOpportunityDetail || this.isEditBidOpportunity)) {
        this.router.navigate(['/no-permission']);
      }
    }


    this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
      this.package = result;
    }, err => this.alertService.error('Tải thông tin gói thầu không thành công.'));
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
}
