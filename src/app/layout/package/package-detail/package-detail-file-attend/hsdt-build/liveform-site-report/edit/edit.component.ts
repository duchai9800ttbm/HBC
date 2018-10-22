import { Component, OnInit, OnDestroy } from '@angular/core';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../shared/configs/datepicker.config';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService, SessionService, UserService } from '../../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentService } from '../../../../../../../shared/services/document.service';
import { LiveformSiteReportComponent } from '../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../../shared/models/package/package-info.model';
import { SiteSurveyReportService } from '../../../../../../../shared/services/site-survey-report.service';
import { CustomerContact } from '../../../../../../../shared/models/site-survey-report/customer-contact';
import { DepartmentList } from '../../../../../../../shared/models/site-survey-report/department-list';
import { UserList } from '../../../../../../../shared/models/site-survey-report/user-list';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  dtTrigger: Subject<any> = new Subject();
  showBeforeLogin: any = true;
  showAfterLogin: any;
  isData;
  showPopupConfirm = false;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  stepNameList = [
    'ScaleOverallComponent',
    'DescribeOverallComponent',
    'TrafficComponent',
    'DemoConsoComponent',
    'ServiceConstructionComponent',
    'SoilConditionComponent',
    'UsefulInfoComponent'
  ];
  stepName;
  currentBidOpportunityId: number;
  packageData = new PackageInfoModel();
  listCustomerContact = new Array(new CustomerContact());
  customerId;
  listDepartments = new Array(new DepartmentList());
  departmentId;
  listUser: UserList[];
  ngayKhaoSat;
  isDraft: boolean;
  isCreate: boolean;
  isViewMode: boolean;
  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private packageService: PackageService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.departmentId = 49;
    this.customerId = '';
    this.getInfoTenderPreparationPlanning();
    this.getAllUser();
    this.isCreate = LiveformSiteReportComponent.formModel.isCreate;
    this.isDraft = LiveformSiteReportComponent.formModel.isDraft;
    this.isViewMode = LiveformSiteReportComponent.isViewMode;
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.packageService.getInforPackageID(this.currentBidOpportunityId).subscribe(result => {
      this.packageData = result;
    }, err => {
      this.alertService.error('Tải thông tin gói thầu không thành công.');
    });
  }
  getAllUser() {
    this.siteSurveyReportService.getAllUser('').subscribe(data => {
      this.listUser = data;
      this.listUser.forEach(x => {
        this.listCustomerContact.push({
          employeeId: x.employeeId,
          employeeName: x.employeeName
        });
        if (x.department) {
          let checkduplicate: boolean;
          this.listDepartments.forEach(item => {
            if (item.key === x.department.key) {
              checkduplicate = true;
            } else { checkduplicate = false; }
          });
          if (!checkduplicate) {
            this.listDepartments.push({
              key: x.department.key,
              value: x.department.value
            });
          }
        }
      });
    }, err => {
      this.alertService.error('Tải thông tin người dùng không thành công.');
    });
  }
  getInfoTenderPreparationPlanning() {
    this.packageService.getTenderPreparationPlanning(this.currentBidOpportunityId).subscribe(data => {
      this.ngayKhaoSat = data.finishDate;
    }, err => {
      this.alertService.error('Lấy thông tin Phân công tiến độ không thành công.');
    });
  }
  submitLiveForm(event) {
    LiveformSiteReportComponent.isViewMode = true;
    this.isViewMode = true;
    LiveformSiteReportComponent.formModel.phongBan = {
      id: this.departmentId,
      text: ''
    };
    LiveformSiteReportComponent.formModel.nguoiKhaoSat = {
      id: this.customerId,
      text: ''
    };
    this.showPopupConfirm = false;
    if (!event) {
      this.showPopupConfirm = false;
    } else {
      const objData = LiveformSiteReportComponent.formModel;
      this.showPopupConfirm = false;
      this.spinner.show();
      this.siteSurveyReportService
        .createOrUpdateSiteSurveyingReport(objData)
        .subscribe(() => {
          this.showPopupConfirm = false;
          this.spinner.hide();
          this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite`]);
          const message = (this.isCreate) ? 'Tạo' : 'Cập nhật';
          this.alertService.success(`${message} Báo cáo khảo sát công trường thành công.`);
        }, err => {
          this.showPopupConfirm = false;
          this.spinner.hide();
          const message = (this.isCreate) ? 'Tạo' : 'Cập nhật';
          this.alertService.error(`Đã xảy ra lỗi. ${message} Báo cáo khảo sát công trường không thành công.`);
        });
      // LiveformSiteReportComponent.isViewMode = true;
    }
  }

  refresh(): void {
    this.spinner.show();
    this.dtTrigger.next();
    this.spinner.hide();
    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
  }

  updateliveform(check: boolean) {
    LiveformSiteReportComponent.formModel.isDraft = check;
    if (check || this.isCreate) {
      this.submitLiveForm(true);
    } else {
      this.showPopupConfirm = true;
    }
  }
  cancelCreateUpdate() {
    this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite`]);
  }
  submiToApprove() {
    this.alertService.error('Chưa có API gửi duyệt LiveForm Công trình');
  }
  editLiveform() {
    LiveformSiteReportComponent.isViewMode = false;
    this.isViewMode = false;
    this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit`]);
  }

  disableSideMenu(event) {
    this.stepName = event.constructor.name;
    const elem = document.getElementById('toggle-menu');
    const elemm = document.getElementById('header-table-build');
    elem.style.display = 'none';
    elemm.style.visibility = 'hidden';
    elemm.style.position = 'absolute';
  }
  nextStep() {
    const index = this.stepNameList.indexOf(this.stepName);
    switch (index) {
      case 0: {
        const step = `describe`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 1: {
        const step = `traffic`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 2: {
        const step = `demo-conso`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 3: {
        const step = `service-construction`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 4: {
        const step = `soil`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 5: {
        const step = `moreinfo`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
    }
  }
  preStep() {
    const index = this.stepNameList.indexOf(this.stepName);
    switch (index) {
      case 2: {
        const step = `describe`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 3: {
        const step = `traffic`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 4: {
        const step = `demo-conso`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 5: {
        const step = `service-construction`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 6: {
        const step = `soil`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 1: {
        const step = `scale`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
    }
  }
  ngOnDestroy() {
    const elem = document.getElementById('toggle-menu');
    const elemm = document.getElementById('header-table-build');
    elem.style.display = 'unset';
    elemm.style.visibility = 'unset';
    elemm.style.position = 'static';
  }
}
