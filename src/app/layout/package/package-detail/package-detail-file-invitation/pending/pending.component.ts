import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../../../../node_modules/rxjs/Observable';
import { DictionaryItem, PagedResult } from '../../../../../shared/models';
import { Subject } from '../../../../../../../node_modules/rxjs/Subject';
import { ActivityFilter } from '../../../../../shared/models/activity/activity-filter.model';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { ActivityListItem } from '../../../../../shared/models/activity/activity-list-item.model';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { FormGroup, FormBuilder, Validators } from '../../../../../../../node_modules/@angular/forms';
import { ActivityService, AlertService, DataService, ConfirmationService, UserService } from '../../../../../shared/services';
import { Router, ActivatedRoute } from '../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../../../node_modules/@ngx-translate/core';
import { DownloadTemplateService } from '../../../../../shared/services/download-template.service';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { BehaviorSubject } from '../../../../../../../node_modules/rxjs/BehaviorSubject';
import { PackageDetailComponent } from '../../package-detail.component';
import DateTimeConvertHelper from '../../../../../shared/helpers/datetime-convert-helper';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import * as moment from 'moment';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { routerTransition } from '../../../../../router.animations';
import { FakeDocumentAssessment } from '../../../../../shared/fake-data/document-assessment';
import { TemplatePending } from '../../../../../shared/fake-data/template-pending';
import { PackageService } from '../../../../../shared/services/package.service';
import { TypeDocument } from '../../../../../shared/models/package/type-document';
import { BidDocumentFilter } from '../../../../../shared/models/document/bid-document-filter.model';
import { DocumentService } from '../../../../../shared/services/document.service';
import { groupBy } from '@progress/kendo-data-query';
import { OpportunityHsmtService } from '../../../../../shared/services/opportunity-hsmt.service';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { BidDocumentGroupModel } from '../../../../../shared/models/document/bid-document-group.model';
import { BidDocumentModel } from '../../../../../shared/models/document/bid-document.model';
import { BidDocumentReviewFilter } from '../../../../../shared/models/document/bid-document-review-filter.model';
import { BidDocumentReviewModel } from '../../../../../shared/models/document/bid-document-review.model';
import { DocumentReviewService } from '../../../../../shared/services/document-review.service';
import { PackageModel } from '../../../../../shared/models/package/package.model';
@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss'],
  animations: [routerTransition()]

})
export class PendingComponent implements OnInit {
  activityStatusList: Observable<DictionaryItem[]>;
  checkboxSeclectAll: boolean;
  dtOptions: any = DATATABLE_CONFIG;
  dtOptions2: any = DATATABLE_CONFIG;

  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();

  pagedResult: PagedResult<ActivityListItem> = new PagedResult<
    ActivityListItem
    >();
  datePickerConfig = DATETIME_PICKER_CONFIG;
  activityForm: FormGroup;
  formErrors = {
    startDate: '',
    endDate: ''
  };
  isSubmitted: boolean;
  invalidMessages: string[];
  showPopupAdd = false;
  filterModelServer: BidDocumentFilter;
  listUploaderServer: any[];
  pendingPackageDataServer: any[];
  // pendingPackageData = FakeDocumentAssessment;
  pendingPackageData: any[];
  templatePackageData = TemplatePending;
  listUploader: any[];

  filterModel2 = new BidDocumentReviewFilter();
  bidDocumentReviewListItem: BidDocumentReviewModel[];
  bidDocumentReviewListItemSearchResult: BidDocumentReviewModel[];
  packageId;
  searchTerm;
  searchTerm2;

  filterModel = new BidDocumentFilter();
  userListItem: UserItemModel[];
  bidDocumentListItem: BidDocumentModel[];
  bidDocumentGroupListItem: BidDocumentGroupModel[];
  bidDocumentGroupListItemSearchResult: BidDocumentGroupModel[];
  packageData: PackageModel;

  constructor(
    private activityService: ActivityService,
    private alertService: AlertService,
    private dataService: DataService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private excelService: ExcelService,
    private translateService: TranslateService,
    private downloadTemplate: DownloadTemplateService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private activetedRoute: ActivatedRoute,
    private packageService: PackageService,
    private documentService: DocumentService,
    private opportunityHsmtService: OpportunityHsmtService,
    private userService: UserService,
    private documentReviewService: DocumentReviewService

  ) { }

  searchTerm$ = new BehaviorSubject<string>('');

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.packageData = result;
      switch (this.packageData.stageStatus) {
        case 'CanBoSungHSMT': {
          this.router.navigate([`/package/detail/${this.packageId}/invitation/add-file`]);
          break;
        }
        case 'CanDanhGiaHSMT': {
          this.router.navigate([`/package/detail/${this.packageId}/invitation/evaluate`]);
          break;
        }
        case 'CanLapDeNghiMoiThau': {
          this.router.navigate([`/package/detail/${this.packageId}/invitation/suggest`]);
          break;
        }
        case 'ChoDuyet': {
          break;
        }
        case 'DaDuyet': {
          this.router.navigate([`/package/detail/${this.packageId}/invitation/approved`]);
          break;
        }
        case 'DaTuChoi': {
          this.router.navigate([`/package/detail/${this.packageId}/invitation/has-declined`]);
          break;
        }
        case 'DaGuiThuTuChoi': {
          this.router.navigate([`/package/detail/${this.packageId}/invitation/rejection-letter`]);
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    });
    // config
    window.scrollTo(0, 0);
    this.dtOptions = DATATABLE_CONFIG;
    // initFilterModel
    this.filterModel.status = 'Official';
    this.filterModel.uploadedEmployeeId = null;

    this.filterModel2.status = 'Official';
    // this.filterModel.createDate = new Date();
    // get OpportunityId
    this.packageId = +PackageDetailComponent.packageId;
    // danh sách người upload (lấy từ danh sách user)
    this.userService.getAllUser('').subscribe(data => {
      this.userListItem = data;
    });
    // danh sách tài liệu
    this.spinner.show();
    this.documentService.readAndGroup(this.packageId).subscribe(response => {
      this.bidDocumentGroupListItem = response;
      this.bidDocumentGroupListItemSearchResult = response;
      this.bidDocumentGroupListItemSearchResult = this.documentService
        .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
      this.dtTrigger.next();
      this.spinner.hide();
    }, err => this.spinner.hide());


    this.documentReviewService.read(this.packageId).subscribe(response => {
      this.bidDocumentReviewListItem = response;
      this.bidDocumentReviewListItemSearchResult = response;
      this.bidDocumentReviewListItemSearchResult = this.documentReviewService
        .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);
      this.dtTrigger2.next();
    });
  }


  closePopup(agreed: boolean) {
    this.showPopupAdd = false;
    if (agreed === true) {
      this.opportunityHsmtService.submitProposal(this.packageId).subscribe(result => {
        this.suggest();
      },
        err => {
          this.alertService.success('Đã gặp sự cố. Gửi duyệt không thành công!');
        });
    }
  }

  suggest() {
    this.spinner.show();
    setTimeout(() => {
      this.router.navigate([`/package/detail/${this.packageId}/invitation/pending`]);
      this.alertService.success('Đã gửi đề nghị dự thầu thành công, chờ duyệt!');
    }, 500);
  }

  search(value) {
    this.searchTerm = value;
    this.bidDocumentGroupListItemSearchResult = this.documentService
      .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
    this.dtTrigger.next();
  }

  filter() {
    this.bidDocumentGroupListItemSearchResult = this.documentService
      .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
    this.dtTrigger.next();
  }


  multiDelete() {
    // const deleteIds = this.pagedResult.items
    //     .filter(x => x.checkboxSelected)
    //     .map(x => {
    //         return {
    //             id: +x.id,
    //             activityType: x.activityType ? x.activityType.toLowerCase() : ''
    //         };
    //     });
    // if (deleteIds.length === 0) {
    //     this.alertService.error(
    //         'Bạn phải chọn ít nhất một gói thầu để xóa!'
    //     );
    // } else {
    //     // this.delete(deleteIds);
    // }
  }

  clearFilter() {
    this.filterModel = new BidDocumentFilter();
    this.filterModel.status = 'Official';
    this.filterModel.uploadedEmployeeId = null;
    this.bidDocumentGroupListItemSearchResult = this.documentService
      .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
    this.dtTrigger.next();
  }

  refresh(): void {
    this.filterModel = new BidDocumentFilter();
    this.filterModel.status = 'Official';
    this.filterModel.uploadedEmployeeId = null;
    this.searchTerm = '';
    this.spinner.show();
    this.documentService.readAndGroup(this.packageId).subscribe(response => {
      this.bidDocumentGroupListItem = response;
      this.bidDocumentGroupListItemSearchResult = response;
      this.bidDocumentGroupListItemSearchResult = this.documentService
        .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
      this.dtTrigger.next();
      this.spinner.hide();
      this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
    });
  }

  refresh2(): void {
    this.filterModel2 = new BidDocumentReviewFilter();
    this.filterModel2.status = 'Official';
    this.searchTerm2 = '';
    this.filterModel2.uploadedEmployeeId = null;
    this.spinner.show();
    this.documentReviewService.read(this.packageId).subscribe(response => {
      this.bidDocumentReviewListItem = response;
      this.bidDocumentReviewListItemSearchResult = response;
      this.bidDocumentReviewListItemSearchResult = this.documentReviewService
        .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);
      this.dtTrigger2.next();
      this.spinner.hide();
    });
  }


  onSelectAll(value: boolean) {
    //    this.pagedResult.items.forEach(x => (x.checkboxSelected = value));
  }


  renderIndex(i, k) {
    let dem = 0;
    let tam = -1;
    if (+i === 0) {
      return k + 1;
    } else {
      this.bidDocumentGroupListItemSearchResult.forEach(ite => {
        if (tam < +i - 1) {
          ite.items.forEach(e => {
            dem++;
          });
        }
        tam++;
      });
      return dem + k + 1;
    }
  }

  dowloadDocument(id) {
    this.documentService.download(id).subscribe(data => {
    });
  }


  tuChoi() {
    const that = this;
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn từ chối dự thầu?',
      () => {
        this.opportunityHsmtService.hasDeclined(this.packageId).subscribe(data => {
          that.alertService.success('Đã duyệt từ chối dự thầu thành công!');
          that.router.navigate([`/package/detail/${this.packageId}/invitation/has-declined`]);
        }, err => {
          that.alertService.error('Từ chối dự thầu thất bại, xin vui lòng thử lại!');
        });
      }
    );
  }

  thamGiaDuThau() {
    const that = this;
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn gửi duyệt đề nghị dự thầu?',
      () => {
        this.opportunityHsmtService.joinBid(this.packageId).subscribe(data => {
          that.alertService.success('Đã tham gia dự thầu thành công!');
          that.router.navigate([`/package/detail/${this.packageId}/invitation/approved`]);
        }, err => {
          that.alertService.error('Đã tham gia dự thầu thất bại, xin vui lòng thử lại!');
        });
      }
    );
  }

  // clearFilter2() {
  //   this.filterModel2 = new BidDocumentReviewFilter();
  //   this.filterModel2.uploadedEmployeeId = null;
  //   this.filterModel2.status = 'Official';
  //   this.bidDocumentReviewListItemSearchResult = this.documentReviewService
  //     .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);
  //   this.dtTrigger2.next();
  // }

  // filter2() {
  //   this.bidDocumentReviewListItemSearchResult = this.documentReviewService
  //     .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);
  //   this.dtTrigger2.next();
  // }

  search2(value) {
    this.searchTerm2 = value;
    this.filterModel2.status = 'Official';
    this.bidDocumentReviewListItemSearchResult = this.documentReviewService
      .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);
    this.dtTrigger2.next();
  }

  dowloadDocumentReview(id) {
    this.documentReviewService.download(id).subscribe();
  }
}
