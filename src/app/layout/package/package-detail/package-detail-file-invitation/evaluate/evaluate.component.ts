import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DictionaryItem } from '../../../../../shared/models/dictionary-item.model';
import { DATATABLE_CONFIG } from '../../../../../shared/configs/datatable.config';
import { Subject } from 'rxjs/Subject';
import { ActivityFilter } from '../../../../../shared/models/activity/activity-filter.model';
import { PagedResult } from '../../../../../shared/models';
import { ActivityListItem } from '../../../../../shared/models/activity/activity-list-item.model';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { ActivityService, AlertService, DataService, ConfirmationService, UserService } from '../../../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { TranslateService } from '@ngx-translate/core';
import { DownloadTemplateService } from '../../../../../shared/services/download-template.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PackageDetailComponent } from '../../package-detail.component';
import DateTimeConvertHelper from '../../../../../shared/helpers/datetime-convert-helper';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import { routerTransition } from '../../../../../router.animations';
import * as moment from 'moment';
import { FakeDocumentAssessment } from '../../../../../shared/fake-data/document-assessment';
import { TypeDocument } from '../../../../../shared/models/package/type-document';
import { PackageService } from '../../../../../shared/services/package.service';
import { BidDocumentGroupModel } from '../../../../../shared/models/document/bid-document-group.model';
import { DocumentService } from '../../../../../shared/services/document.service';
import { BidDocumentFilter } from '../../../../../shared/models/document/bid-document-filter.model';
import { groupBy } from '@progress/kendo-data-query';
import { OpportunityHsmtService } from '../../../../../shared/services/opportunity-hsmt.service';
import { UserModel } from '../../../../../shared/models/user/user.model';
import { BidDocumentModel } from '../../../../../shared/models/document/bid-document.model';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { PackageModel } from '../../../../../shared/models/package/package.model';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
@Component({
    selector: 'app-evaluate',
    templateUrl: './evaluate.component.html',
    styleUrls: ['./evaluate.component.scss'],
    // animations: [routerTransition()]

})
export class EvaluateComponent implements OnInit {

    checkboxSeclectAll: boolean;
    dtOptions: any = DATATABLE_CONFIG;
    dtTrigger: Subject<any> = new Subject();
    filterModel = new BidDocumentFilter();
    searchTerm;
    pagedResultUser: PagedResult<UserModel> = new PagedResult<UserModel>();
    datePickerConfig = DATETIME_PICKER_CONFIG;
    packageId;
    showPopupAdd = false;
    typeFileUpload = {
        id: 'Drawing',
        text: 'Bản vẽ',
    };
    userListItem: UserItemModel[];
    bidDocumentListItem: BidDocumentModel[];
    bidDocumentGroupListItem: BidDocumentGroupModel[];
    bidDocumentGroupListItemSearchResult: BidDocumentGroupModel[];
    packageData: PackageInfoModel;
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

    ) { }

    searchTerm$ = new BehaviorSubject<string>('');
    searchTearm;

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

    openPopupUploadFile(documentType) {
        if (documentType === 'Drawing') {
            this.typeFileUpload = {
                id: 'Drawing',
                text: 'Bản vẽ',
            };
        } else if (documentType === 'Book') {
            this.typeFileUpload = {
                id: 'Book',
                text: 'Cuốn hồ sơ mời thầu',
            };
        } else if (documentType === 'TechnicalStandard') {
            this.typeFileUpload = {
                id: 'TechnicalStandard',
                text: 'Tiêu chuẩn kĩ thuật',
            };
        } else if (documentType === 'BOQ') {
            this.typeFileUpload = {
                id: 'BOQ',
                text: 'BOQ',
            };
        } else if (documentType === 'GeologicalSurvey') {
            this.typeFileUpload = {
                id: 'GeologicalSurvey',
                text: 'Khảo sát địa chất',
            };
        }
        this.showPopupAdd = true;
    }

    uploadFileItem(type) {
        if (type === 'Drawing') {
            this.typeFileUpload = {
                id: 'Drawing',
                text: 'Bản vẽ',
            };
        } else if (type === 'Book') {
            this.typeFileUpload = {
                id: 'Book',
                text: 'Cuốn hồ sơ mời thầu',
            };
        } else if (type === 'TechnicalStandard') {
            this.typeFileUpload = {
                id: 'TechnicalStandard',
                text: 'Tiêu chuẩn kĩ thuật',
            };
        } else if (type === 'BOQ') {
            this.typeFileUpload = {
                id: 'BOQ',
                text: 'BOQ',
            };
        } else if (type === 'GeologicalSurvey') {
            this.typeFileUpload = {
                id: 'GeologicalSurvey',
                text: 'Khảo sát địa chất',
            };
        }
        this.showPopupAdd = true;
    }

    closePopup(params) {
        this.showPopupAdd = false;
        this.spinner.show();
        this.documentService.readAndGroup(this.packageId).subscribe(response => {
            this.bidDocumentGroupListItem = response;
            this.bidDocumentGroupListItemSearchResult = response;
            this.dtTrigger.next();
            this.spinner.hide();
        });
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

    sendEvaluate() {
        if (!this.checkSendEvaluate()) {
            this.alertService.error('Vui lòng chọn đủ 5 loại tài liệu chính thức');
        } else {
            const that = this;
            this.confirmationService.confirm(
                'Bạn có muốn chuyển đánh giá ?',
                () => {
                    that.spinner.show();
                    setTimeout(() => {
                        this.opportunityHsmtService.moveEvaluate(this.packageId).subscribe(result => {
                            that.router.navigate([`/package/detail/${this.packageId}/invitation/evaluate`]);
                            that.alertService.success('Chuyển đánh giá thành công!');
                        },
                            err => {
                                that.alertService.success('Chuyển đánh giá không thành công. Bạn vui lòng kiểm tra lại!');
                            });
                    }, 500);
                }
            );
        }
    }

    checkSendEvaluate(): boolean {
        const check = this.bidDocumentGroupListItem
            .every(documentType => documentType.items.some(item => item.status === 'Official'))
            && this.bidDocumentGroupListItem.length === 5;
        return check;
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

    changeStatus(id, status, type) {
        this.bidDocumentGroupListItem.forEach(i => {
            if (i.documentType === type) {
                i.items.forEach(item => {
                    if (item.id !== +id) {
                        item.status = 'Draft';
                    }
                });
                i.items.forEach(item => {
                    if (item.id === +id) {
                        item.status = status === 'Draft' ? 'Official' : 'Draft';
                    }
                });
            }
        });
        this.bidDocumentGroupListItemSearchResult.forEach(i => {
            if (i.documentType === type) {
                i.items.forEach(item => {
                    if (item.id !== +id) {
                        item.status = 'Draft';
                    }
                });
                i.items.forEach(item => {
                    if (item.id === +id) {
                        item.status = status === 'Draft' ? 'Official' : 'Draft';
                        this.documentService.updateStatus(id, item.status).subscribe();
                    }
                });
            }
        });
    }


    deleteDocument(id) {
        const that = this;
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa tài liệu này?',
            () => {
                this.documentService.delete(id).subscribe(data => {
                    that.alertService.success('Đã xóa tài liệu!');
                    that.refresh();
                });
            }
        );
    }

    dowloadDocument(id) {
        this.documentService.download(id).subscribe(data => {
        });
    }

    success() {
        const that = this;
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn đánh giá hồ sơ đạt?',
            () => {
                this.opportunityHsmtService.evaluatePass(this.packageId).subscribe(data => {
                    that.router.navigate([`/package/detail/${this.packageId}/invitation/suggest`]);
                    that.alertService.success('Đã đánh giá hồ sơ đạt!');
                });
            }
        );
    }

    fail() {
        const that = this;
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn đánh giá hồ sơ không đạt?',
            () => {
                this.opportunityHsmtService.evaluatePassFail(this.packageId).subscribe(data => {
                    that.router.navigate([`/package/detail/${this.packageId}/invitation/add-file`]);
                    that.alertService.success('Đã đánh giá hồ sơ không đạt!');
                });
            }
        );
    }
}
