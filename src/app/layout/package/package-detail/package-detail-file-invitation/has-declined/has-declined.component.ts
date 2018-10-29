import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../../router.animations';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Subject } from '../../../../../../../node_modules/rxjs/Subject';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { AlertService, UserService } from '../../../../../shared/services';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { PackageDetailComponent } from '../../package-detail.component';
import { BehaviorSubject } from '../../../../../../../node_modules/rxjs/BehaviorSubject';
import { BidDocumentFilter } from '../../../../../shared/models/document/bid-document-filter.model';
import { DocumentService } from '../../../../../shared/services/document.service';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { BidDocumentModel } from '../../../../../shared/models/document/bid-document.model';
import { BidDocumentGroupModel } from '../../../../../shared/models/document/bid-document-group.model';
import { DocumentReviewService } from '../../../../../shared/services/document-review.service';
import { BidDocumentReviewModel } from '../../../../../shared/models/document/bid-document-review.model';
import { BidDocumentReviewFilter } from '../../../../../shared/models/document/bid-document-review-filter.model';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageModel } from '../../../../../shared/models/package/package.model';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
@Component({
  selector: 'app-has-declined',
  templateUrl: './has-declined.component.html',
  styleUrls: ['./has-declined.component.scss'],
  // animations: [routerTransition()]

})
export class HasDeclinedComponent implements OnInit {

  checkboxSeclectAll: boolean;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();

  dtOptions2: any = DATATABLE_CONFIG;
  dtTrigger2: Subject<any> = new Subject();
  datePickerConfig = DATETIME_PICKER_CONFIG;

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
  packageData: PackageInfoModel;
  constructor(
    private alertService: AlertService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private userService: UserService,
    private documentReviewService: DocumentReviewService,
    private packageService: PackageService
  ) { }

  searchTerm$ = new BehaviorSubject<string>('');

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
        this.packageService.getInforPackageID(this.packageId).subscribe(result => {
            this.packageData = result;
            switch (this.packageData.stageStatus.id) {
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
                    this.router.navigate([`/package/detail/${this.packageId}/invitation/pending`]);
                    break;
                }
                case 'DaDuyet': {
                    this.router.navigate([`/package/detail/${this.packageId}/invitation/approved`]);
                    break;
                }
                case 'DaTuChoi': {
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
    });



    this.documentReviewService.read(this.packageId).subscribe(response => {
      this.bidDocumentReviewListItem = response;
      this.bidDocumentReviewListItemSearchResult = response;
      this.bidDocumentReviewListItemSearchResult = this.documentReviewService
        .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);

      this.dtTrigger2.next();
    });

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

  clearFilter() {
    this.filterModel = new BidDocumentFilter();
    this.filterModel.status = 'Official';
    this.filterModel.uploadedEmployeeId = null;
    this.bidDocumentGroupListItemSearchResult = this.documentService
      .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
    this.dtTrigger.next();
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

  
  search2(value) {
    this.searchTerm2 = value;
    this.filterModel2.status = 'Official';
    this.bidDocumentReviewListItemSearchResult = this.documentReviewService
      .filter(this.searchTerm2, this.filterModel2, this.bidDocumentReviewListItem);
    this.dtTrigger2.next();
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

  sendRejectionLetter() {
    this.router.navigate([`/package/detail/${this.packageId}/invitation/send-mail`]);
  }

  dowloadDocumentReview(id) {
    this.documentReviewService.download(id).subscribe();
  }
}
