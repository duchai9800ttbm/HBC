import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Subject } from '../../../../../../../node_modules/rxjs/Subject';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { AlertService, ConfirmationService, UserService } from '../../../../../shared/services';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { PackageDetailComponent } from '../../package-detail.component';
import * as moment from 'moment';
import { routerTransition } from '../../../../../router.animations';
import { TemplateAssessment } from '../../../../../shared/fake-data/template-assessment';
import { DocumentService } from '../../../../../shared/services/document.service';
import { BidDocumentFilter } from '../../../../../shared/models/document/bid-document-filter.model';
import { OpportunityHsmtService } from '../../../../../shared/services/opportunity-hsmt.service';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { BidDocumentModel } from '../../../../../shared/models/document/bid-document.model';
import { BidDocumentGroupModel } from '../../../../../shared/models/document/bid-document-group.model';
import { DocumentReviewService } from '../../../../../shared/services/document-review.service';
import { BidDocumentReviewFilter } from '../../../../../shared/models/document/bid-document-review-filter.model';
import { BidDocumentReviewModel } from '../../../../../shared/models/document/bid-document-review.model';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageModel } from '../../../../../shared/models/package/package.model';
@Component({
  selector: 'app-suggest',
  templateUrl: './suggest.component.html',
  styleUrls: ['./suggest.component.scss'],
  animations: [routerTransition()]

})
export class SuggestComponent implements OnInit {

  checkboxSeclectAll: boolean;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();

  dtOptions2: any = DATATABLE_CONFIG;
  dtTrigger2: Subject<any> = new Subject();
  datePickerConfig = DATETIME_PICKER_CONFIG;

  showPopupAdd = false;
  showPopupUploadFile = false;

  packageId;
  searchTerm;
  searchTerm2;
  filterModel = new BidDocumentFilter();
  filterModel2 = new BidDocumentReviewFilter();
  bidDocumentReviewListItem: BidDocumentReviewModel[];
  bidDocumentReviewListItemSearchResult: BidDocumentReviewModel[];

  userListItem: UserItemModel[];
  bidDocumentListItem: BidDocumentModel[];
  bidDocumentGroupListItem: BidDocumentGroupModel[];
  bidDocumentGroupListItemSearchResult: BidDocumentGroupModel[];
  packageData: PackageModel;
  constructor(
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private opportunityHsmtService: OpportunityHsmtService,
    private userService: UserService,
    private documentReviewService: DocumentReviewService,
    private packageService: PackageService
  ) { }

  templatePackageData = TemplateAssessment;
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
          break;
        }
        case 'ChoDuyet': {
          this.router.navigate([`/package/detail/${this.packageId}/invitation/pending`]);
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

    this.filterModel2.uploadedEmployeeId = null;
    this.filterModel2.status = '';

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
    });



    this.documentReviewService.read(this.packageId).subscribe(response => {
      this.bidDocumentReviewListItem = response;
      this.bidDocumentReviewListItemSearchResult = response;
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
    this.dtTrigger2.next();
  }

  search2(value) {
    this.searchTerm2 = value;
    this.bidDocumentReviewListItemSearchResult = this.documentReviewService
      .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);
    this.dtTrigger2.next();
  }

  filter2() {
    this.bidDocumentReviewListItemSearchResult = this.documentReviewService
      .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);
    this.dtTrigger2.next();
  }


  clearFilter() {
    this.filterModel = new BidDocumentFilter();
    this.filterModel.status = 'Official';
    this.filterModel.uploadedEmployeeId = null;
    this.bidDocumentGroupListItemSearchResult = this.documentService
      .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
    this.dtTrigger.next();
  }


  clearFilter2() {
    this.filterModel2 = new BidDocumentReviewFilter();
    this.filterModel2.uploadedEmployeeId = null;
    this.filterModel2.status = '';
    this.bidDocumentReviewListItemSearchResult = this.documentReviewService
      .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);
    this.dtTrigger2.next();
  }



  refresh(): void {
    this.spinner.show();
    this.documentService.readAndGroup(this.packageId).subscribe(response => {
      this.bidDocumentGroupListItem = response;
      this.bidDocumentGroupListItemSearchResult = response;
      this.dtTrigger.next();
      this.spinner.hide();
      this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
    });

    this.spinner.show();
    this.documentReviewService.read(this.packageId).subscribe(response => {
      this.bidDocumentReviewListItem = response;
      this.bidDocumentReviewListItemSearchResult = response;
      this.dtTrigger2.next();
      this.spinner.hide();
      this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
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

  changeStatus(id, status) {
    this.bidDocumentReviewListItem.forEach(item => {
      if (item.id !== +id) {
        item.bidReviewDocumentStatus = 'Draft';
      }
      if (item.id === +id) {
        item.bidReviewDocumentStatus = status === 'Draft' ? 'Official' : 'Draft';
      }
    });
    this.bidDocumentReviewListItemSearchResult.forEach(item => {
      if (item.id !== +id) {
        item.bidReviewDocumentStatus = 'Draft';
      }
      if (item.id === +id) {
        item.bidReviewDocumentStatus = status === 'Draft' ? 'Official' : 'Draft';
        this.documentReviewService.updateStatus(item.id, item.bidReviewDocumentStatus).subscribe();
      }
    });
  }


  dowloadDocument(id) {
    this.documentService.download(id).subscribe(data => {
    });
  }

  dowloadDocumentReview(id) {
    this.documentReviewService.download(id).subscribe();
  }

  openPopupUploadFile() {
    this.showPopupAdd = true;
  }
  guiDuyet() {
    const that = this;
    if (!this.checkGuiDuyet()) {
      this.alertService.error('Vui lòng chọn 1 loại bảng xem xét chính thức!');
    } else {
      this.confirmationService.confirm(
        'Bạn có chắc chắn muốn gửi duyệt đề nghị dự thầu?',
        () => {
          this.opportunityHsmtService.submitProposal(this.packageId).subscribe(data => {
            that.alertService.success('Đã duyệt đề nghị dự thầu thành công!');
            that.router.navigate([`/package/detail/${this.packageId}/invitation/pending`]);
          }, err => {
            that.alertService.error('Duyệt đề nghị thất bại, xin vui lòng thử lại!');
          });
        }
      );
    }
  }

  checkGuiDuyet() {
    const check = this.bidDocumentReviewListItem.some(item => item.bidReviewDocumentStatus === 'Official');
    return check;
  }
  upLoadBangXemXet() {
    this.showPopupUploadFile = true;
  }
  closePopupUpLoad(e) {
    this.showPopupUploadFile = false;
    if (e) {
      this.spinner.show();
      this.documentReviewService.read(this.packageId).subscribe(response => {
        this.bidDocumentReviewListItem = response;
        this.bidDocumentReviewListItemSearchResult = response;
        this.dtTrigger2.next();
        this.spinner.hide();
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      });
    }

  }
  downloadTemplate() {
    this.documentReviewService.downloadTemplate().subscribe();
  }
}
