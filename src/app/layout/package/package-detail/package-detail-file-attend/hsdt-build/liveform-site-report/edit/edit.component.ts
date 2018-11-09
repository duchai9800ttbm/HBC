import { Component, OnInit, OnDestroy } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Subject, Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../../../shared/services';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../../shared/models/package/package-info.model';
import { SiteSurveyReportService } from '../../../../../../../shared/services/site-survey-report.service';
import { HoSoDuThauService } from '../../../../../../../shared/services/ho-so-du-thau.service';
import { CustomerModel } from '../../../../../../../shared/models/site-survey-report/customer-list';
import { DepartmentsFormBranches } from '../../../../../../../shared/models/user/departments-from-branches';
import { SiteSurveyReport } from '../../../../../../../shared/models/site-survey-report/site-survey-report';
import { ScaleOverall, ConstructionItem } from '../../../../../../../shared/models/site-survey-report/scale-overall.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  static liveformData: SiteSurveyReport = new SiteSurveyReport();
  static actionMode: string;
  dtTrigger: Subject<any> = new Subject();
  showBeforeLogin: any = true;
  showAfterLogin: any;
  isData;
  showPopupConfirm = false;
  stepName: string;
  bidOpportunityId: number;
  packageData = new PackageInfoModel();
  customerId;
  customerName;
  listDepartments = new Array<DepartmentsFormBranches>();
  departmentId;
  departmentNo;
  departmentName;
  listCustomerContact: CustomerModel[];
  ngayKhaoSat;
  isDraft: boolean;
  isCreate: boolean;
  // Set ActionMode
  isViewMode = false;
  isCreateMode = false;
  isEditMode = false;
  // End Set ActionMode
  subscription: Subscription;
  isClosedHSDT: boolean;
  dataDNDT;
  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private packageService: PackageService,
    private router: Router,
    private alertService: AlertService,
    private hoSoDuThauService: HoSoDuThauService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // Check Action Mode
    const activate$ = this.activatedRoute.params.subscribe(data => {
      switch (data.action) {
        case 'create': {
          this.isCreate = true;
          this.isCreateMode = true;
          EditComponent.actionMode = 'create';
          break;
        }
        case 'edit': {
          this.isEditMode = true;
          EditComponent.actionMode = 'edit';
          break;
        }
        case 'info': {
          this.isViewMode = true;
          EditComponent.actionMode = 'info';
          break;
        }
      }
    });
    // End Check Action Mode
    this.subscription = this.hoSoDuThauService.watchStatusPackage().subscribe(status => {
      this.isClosedHSDT = status;
    });
    this.bidOpportunityId = +PackageDetailComponent.packageId;
    const getInfoTenderPrepare$ = this.getInfoTenderPreparationPlanning();
    const getAllUser$ = this.getAllUser();
    const getListDepartments$ = this.getDepartment();
    const getInforPackageID$ = this.packageService.getInforPackageID(this.bidOpportunityId).subscribe(result => {
      this.packageData = result;
    }, err => this.alertService.error('Tải thông tin gói thầu không thành công.'));
    const loadData$ = this.loadData();

    this.subscription.add(getInfoTenderPrepare$);
    this.subscription.add(getAllUser$);
    this.subscription.add(getInforPackageID$);
    this.subscription.add(getListDepartments$);
    this.subscription.add(loadData$);
    this.subscription.add(activate$);
  }
  loadData() {
    const dataPackageInfo = this.siteSurveyReportService.getPackageData();
    const getDataReport$ = this.packageService.getProposedTenderParticipateReport(this.bidOpportunityId)
      .switchMap(dataDNDT => {
        this.dataDNDT = dataDNDT;
        return this.siteSurveyReportService.tenderSiteSurveyingReport(this.bidOpportunityId);
      })
      .subscribe(res => {
        if (!res) {
          EditComponent.liveformData = new SiteSurveyReport();
          EditComponent.liveformData.isCreate = true;
          EditComponent.liveformData.isDraft = true;
          EditComponent.liveformData.bidOpportunityId = this.bidOpportunityId;
          EditComponent.liveformData.scaleOverall = new ScaleOverall();
          EditComponent.liveformData.scaleOverall.loaiCongTrinh = new Array<ConstructionItem>();
          EditComponent.liveformData.scaleOverall.trangthaiCongTrinh = [
            {
              text: 'Mới (New)',
              value: '',
              checked: false
            },
            {
              text: 'Thay đổi & bổ sung (Alteration & Additional)',
              value: '',
              checked: false
            },
            {
              text: 'Khác (Other)',
              value: '',
              checked: false
            },
            {
              text: 'Nâng cấp, cải tiến (Renovation)',
              value: '',
              checked: false
            }, {
              text: 'Tháo dỡ & cải tiến (Demolishment & Renovation)',
              value: '',
              checked: false
            }
          ];
          EditComponent.liveformData.scaleOverall.quyMoDuAn = {
            dienTichCongTruong: null,
            tongDienTichXayDung: null,
            soTang: '',
            tienDo: null,
          };
          EditComponent.liveformData.scaleOverall.quyMoDuAn.tongDienTichXayDung = dataPackageInfo && dataPackageInfo.floorArea;
          EditComponent.liveformData.scaleOverall.quyMoDuAn.tienDo = this.dataDNDT.contractCondition.timeForCompletion;
          if (EditComponent.liveformData && !EditComponent.liveformData.scaleOverall.loaiCongTrinh.length && dataPackageInfo) {
            const siteSurvey$ = this.siteSurveyReportService.getListConstructionType().subscribe(ress => {
              const constructionTypes = ress;
              const foundItem = constructionTypes.find(item => item.id == dataPackageInfo.projectType.id);
              foundItem.checked = true;
              constructionTypes[constructionTypes
                .indexOf(constructionTypes.find(item => item.id == dataPackageInfo.projectType.id))] = foundItem;
              EditComponent.liveformData.scaleOverall.loaiCongTrinh = constructionTypes;
              if (EditComponent.liveformData) {
                const phongBan = EditComponent.liveformData.phongBan;
                this.departmentNo = (phongBan) ? phongBan.key : 'PDUTHAU';  // Default PDT
                this.departmentName = (phongBan) ? phongBan.text : '';
                const nguoiKhaoSat = EditComponent.liveformData.nguoiKhaoSat;
                this.customerId = (nguoiKhaoSat) ? nguoiKhaoSat.id : '';
                this.customerName = (nguoiKhaoSat) ? nguoiKhaoSat.text : '';
              }
              this.isDraft = EditComponent.liveformData.isDraft;
              this.siteSurveyReportService.detectSignalLoad(true);
              siteSurvey$.unsubscribe();
            }, err => this.alertService.error('Đã xảy ra lỗi, danh sách loại công trình cập nhật không thành công'));
          }
        } else {
          EditComponent.liveformData = res;
          if (EditComponent.liveformData && !EditComponent.liveformData.scaleOverall.loaiCongTrinh.length && dataPackageInfo) {
            const siteSurvey$ = this.siteSurveyReportService.getListConstructionType().subscribe(ress => {
              const constructionTypes = ress;
              const foundItem = constructionTypes.find(item => item.id == dataPackageInfo.projectType.id);
              foundItem.checked = true;
              constructionTypes[constructionTypes
                .indexOf(constructionTypes.find(item => item.id == dataPackageInfo.projectType.id))] = foundItem;
              EditComponent.liveformData.scaleOverall.loaiCongTrinh = constructionTypes;
              if (EditComponent.liveformData) {
                const phongBan = EditComponent.liveformData.phongBan;
                this.departmentNo = (phongBan) ? phongBan.key : 'PDUTHAU';  // Default PDT
                this.departmentName = (phongBan) ? phongBan.text : '';
                const nguoiKhaoSat = EditComponent.liveformData.nguoiKhaoSat;
                this.customerId = (nguoiKhaoSat) ? nguoiKhaoSat.id : '';
                this.customerName = (nguoiKhaoSat) ? nguoiKhaoSat.text : '';
              }
              this.isDraft = EditComponent.liveformData.isDraft;
              this.siteSurveyReportService.detectSignalLoad(true);
              siteSurvey$.unsubscribe();
            }, err => this.alertService.error('Đã xảy ra lỗi, danh sách loại công trình cập nhật không thành công'));
          }

          if (!(EditComponent.liveformData && !EditComponent.liveformData.scaleOverall.loaiCongTrinh.length && dataPackageInfo)) {
            if (EditComponent.liveformData) {
              const phongBan = EditComponent.liveformData.phongBan;
              this.departmentNo = (phongBan) ? phongBan.key : 'PDUTHAU';  // Default PDT
              this.departmentName = (phongBan) ? phongBan.text : '';
              const nguoiKhaoSat = EditComponent.liveformData.nguoiKhaoSat;
              this.customerId = (nguoiKhaoSat) ? nguoiKhaoSat.id : '';
              this.customerName = (nguoiKhaoSat) ? nguoiKhaoSat.text : '';
              this.isDraft = EditComponent.liveformData.isDraft;
            }
            this.siteSurveyReportService.detectSignalLoad(true);
          }
        }
      });
    this.subscription.add(getDataReport$);

  }
  getDepartment() {
    this.siteSurveyReportService.getListDepartmentsFromBranches().subscribe(res => {
      this.listDepartments = [...res];
    });
  }
  getAllUser() {
    this.siteSurveyReportService.getAllUser('').subscribe(data => {
      this.listCustomerContact = data;
    }, err => this.alertService.error('Tải thông tin người dùng không thành công.'));
  }
  getInfoTenderPreparationPlanning() {
    this.packageService.getTenderPreparationPlanning(this.bidOpportunityId).subscribe(data => {
      const tempDataTasks = data.tasks;
      this.ngayKhaoSat = tempDataTasks.find(item => item.itemId == 6).finishDate;
    }, err => this.alertService.error('Lấy thông tin Phân công tiến độ không thành công.'));
  }
  submitLiveForm(event) {
    EditComponent.actionMode = 'viewMode';
    this.isViewMode = true;
    this.departmentId = this.listDepartments.find(item => item.departmentNo === this.departmentNo).id;
    EditComponent.liveformData.phongBan = {
      id: this.departmentId,
      key: this.departmentNo,
      text: ''
    };
    EditComponent.liveformData.nguoiKhaoSat = {
      id: this.customerId,
      text: ''
    };
    this.showPopupConfirm = false;
    if (!event) {
      this.showPopupConfirm = false;
    } else {
      const objData = EditComponent.liveformData;
      this.showPopupConfirm = false;
      this.siteSurveyReportService
        .createOrUpdateSiteSurveyingReport(objData)
        .subscribe(() => {
          this.showPopupConfirm = false;
          this.hoSoDuThauService.detectUploadFile(true);
          this.router.navigate([`/package/detail/${this.bidOpportunityId}/attend/build/liveformsite`]);
          const message = (this.isCreate) ? 'Tạo mới' : 'Cập nhật';
          this.alertService.success(`${message} Báo cáo khảo sát công trường thành công.`);
          if (!EditComponent.liveformData.isDraft) {
            this.hoSoDuThauService.detectCondition(true);
          }
        }, err => {
          this.showPopupConfirm = false;
          const message = (this.isCreate) ? 'Tạo mới' : 'Cập nhật';
          EditComponent.actionMode = (this.isCreate) ? 'create' : 'edit';
          this.isViewMode = false;
          this.alertService.error(`Đã xảy ra lỗi. ${message} Báo cáo khảo sát công trường không thành công.`);
        });
    }
  }

  refresh(): void {
    this.dtTrigger.next();
    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
  }

  updateliveform(check: boolean) {
    const statusPrevious = EditComponent.liveformData.isDraft;
    EditComponent.liveformData.isDraft = check;
    if (this.isCreate || check || statusPrevious) { return this.submitLiveForm(true); }
    return this.showPopupConfirm = true;
  }
  cancelCreateUpdate() {
    this.router.navigate([`/package/detail/${this.bidOpportunityId}/attend/build/liveformsite`]);
  }
  editLiveform() {
    EditComponent.actionMode = 'edit';
    this.isEditMode = true;
    this.isCreateMode = false;
    this.isViewMode = false;
    this.router.navigate([`/package/detail/${this.bidOpportunityId}/attend/build/liveformsite/form/edit`]);
    this.siteSurveyReportService.detectSignalEdit(true);
  }

  disableSideMenu(event) {
    this.stepName = event.constructor.name;
    const elem = document.getElementById('toggle-menu');
    const elemm = document.getElementById('header-table-build');
    elem.style.display = 'none';
    elemm.style.visibility = 'hidden';
    elemm.style.position = 'absolute';
  }
  ngOnDestroy() {
    const elem = document.getElementById('toggle-menu');
    const elemm = document.getElementById('header-table-build');
    elem.style.display = 'unset';
    elemm.style.visibility = 'unset';
    elemm.style.position = 'static';
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
