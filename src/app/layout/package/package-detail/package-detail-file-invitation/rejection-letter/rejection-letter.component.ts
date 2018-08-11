import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Subject } from '../../../../../../../node_modules/rxjs/Subject';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import {  AlertService , UserService } from '../../../../../shared/services';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { PackageDetailComponent } from '../../package-detail.component';
import * as moment from 'moment';
import { routerTransition } from '../../../../../router.animations';
import { BidDocumentFilter } from '../../../../../shared/models/document/bid-document-filter.model';
import { DocumentService } from '../../../../../shared/services/document.service';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { BidDocumentGroupModel } from '../../../../../shared/models/document/bid-document-group.model';
import { BidDocumentModel } from '../../../../../shared/models/document/bid-document.model';
import { OpportunityHsmtService } from '../../../../../shared/services/opportunity-hsmt.service';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageModel } from '../../../../../shared/models/package/package.model';
@Component({
  selector: 'app-rejection-letter',
  templateUrl: './rejection-letter.component.html',
  styleUrls: ['./rejection-letter.component.scss'],
  animations: [routerTransition()]

})
export class RejectionLetterComponent implements OnInit {

  checkboxSeclectAll: boolean;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  datePickerConfig = DATETIME_PICKER_CONFIG;

  packageId;
  searchTerm;
  filterModel = new BidDocumentFilter();
  userListItem: UserItemModel[];
  bidDocumentListItem: BidDocumentModel[];
  bidDocumentGroupListItem: BidDocumentGroupModel[];
  bidDocumentGroupListItemSearchResult: BidDocumentGroupModel[];
  packageData: PackageModel;
  constructor(
    private alertService: AlertService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private userService: UserService,
    private packageService: PackageService
  ) { }


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

  
}
