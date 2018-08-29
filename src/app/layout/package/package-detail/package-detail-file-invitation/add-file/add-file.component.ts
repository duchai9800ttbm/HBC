import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../../router.animations';
import * as moment from 'moment';
import { DictionaryItem, PagedResult } from '../../../../../shared/models';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Subject } from '../../../../../../../node_modules/rxjs/Subject';
import { AlertService, DataService, ConfirmationService, UserService } from '../../../../../shared/services';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { PackageDetailComponent } from '../../package-detail.component';
import { TypeDocument } from '../../../../../shared/models/package/type-document';
import { DocumentService } from '../../../../../shared/services/document.service';
import { BidDocumentModel } from '../../../../../shared/models/document/bid-document.model';
import { BidDocumentGroupModel } from '../../../../../shared/models/document/bid-document-group.model';
import { UserModel } from '../../../../../shared/models/user/user.model';
import { BidDocumentFilter } from '../../../../../shared/models/document/bid-document-filter.model';
import { OpportunityHsmtService } from '../../../../../shared/services/opportunity-hsmt.service';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { DocumentReviewService } from '../../../../../shared/services/document-review.service';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageModel } from '../../../../../shared/models/package/package.model';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
@Component({
    selector: 'app-add-file',
    templateUrl: './add-file.component.html',
    styleUrls: ['./add-file.component.scss'],
    animations: [routerTransition()]
})
export class AddFileComponent implements OnInit {
    isShowMenu = false;

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
    ListItem: BidDocumentModel[];
    bidDocumentGroupListItem: BidDocumentGroupModel[];
    bidDocumentGroupListItemSearchResult: BidDocumentGroupModel[];
    packageData: PackageInfoModel;
    tableEmpty: boolean;
    constructor(
        private alertService: AlertService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private documentService: DocumentService,
        private userService: UserService,
        private opportunityHsmtService: OpportunityHsmtService,
        private packageService: PackageService
    ) {
    }
    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;
        this.packageService.getInforPackageID(this.packageId).subscribe(result => {
            this.packageData = result;
            // switch (this.packageData.stageStatus.id) {
            //     case 'CanBoSungHSMT': {
            //         break;
            //     }
            //     case 'CanDanhGiaHSMT': {
            //         this.router.navigate([`/package/detail/${this.packageId}/invitation/evaluate`]);
            //         break;
            //     }
            //     case 'CanLapDeNghiMoiThau': {
            //         this.router.navigate([`/package/detail/${this.packageId}/invitation/suggest`]);
            //         break;
            //     }
            //     case 'ChoDuyet': {
            //         this.router.navigate([`/package/detail/${this.packageId}/invitation/pending`]);
            //         break;
            //     }
            //     case 'DaDuyet': {
            //         this.router.navigate([`/package/detail/${this.packageId}/invitation/approved`]);
            //         break;
            //     }
            //     case 'DaTuChoi': {
            //         this.router.navigate([`/package/detail/${this.packageId}/invitation/has-declined`]);
            //         break;
            //     }
            //     case 'DaGuiThuTuChoi': {
            //         this.router.navigate([`/package/detail/${this.packageId}/invitation/rejection-letter`]);
            //         break;
            //     }
            //     default: {
            //         // statements;
            //         break;
            //     }
            // }
        });
        // config
        window.scrollTo(0, 0);
        this.dtOptions = DATATABLE_CONFIG;
        // initFilterModel
        this.filterModel.status = '';
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
            this.dtTrigger.next();
            this.spinner.hide();
        });
    }

    toggleClick() {
        $('.toggle-menu-item').toggleClass('resize');
        // setTimeout( () => ($('.toggle-menu-item').toggleClass('hidden')), 2100);
        $('.iconN1').toggleClass('iconN01');
        $('.iconN2').toggleClass('iconN02');
        $('.iconN3').toggleClass('iconN03');
        console.log('ok');
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
        this.filterModel.status = '';
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
            if (!(this.bidDocumentGroupListItem && this.bidDocumentGroupListItem.length > 1)) {
                document.getElementsByClassName('dataTables_empty')[0].remove();
            }
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
    sendPending() {

    }

    sendEvaluate() {
        const that = this;
        this.confirmationService.confirm(
            'Bạn có muốn chuyển đánh giá ?',
            () => {
                that.spinner.show();
                this.opportunityHsmtService.moveEvaluate(this.packageId).subscribe(result => {
                    that.router.navigate([`/package/detail/${this.packageId}/invitation/evaluate`]);
                    that.spinner.hide();
                    that.alertService.success('Chuyển đánh giá thành công!');
                },
                    err => {
                        that.spinner.hide();
                        that.alertService.error('Chuyển đánh giá không thành công. Bạn vui lòng kiểm tra lại!');
                    });
            }
        );
    }

    checkSendEvaluate(): boolean {
        const check = this.bidDocumentGroupListItem
            .some(documentType => documentType.items.some(item => item.status === 'Official'))
            && this.bidDocumentGroupListItem.length <= 5;
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
    multiDelete() {
        const that = this;
        const listNoGroup = this.documentService.unGroup([...this.bidDocumentGroupListItemSearchResult]);
        const listId = listNoGroup.filter(x => x.checkboxSelected).map(x => x.id);
        if (listId && listId.length === 0) {
            this.alertService.error('Bạn phải chọn ít nhất một tài liệu để xóa!');
        } else {
            this.confirmationService.confirm('Bạn có chắc chắn muốn xóa những tài liệu này?',
                () => {
                    this.documentService.multiDelete(listId).subscribe(data => {
                        that.alertService.success('Đã xóa tài liệu!');
                        that.refresh();
                    });
                });
        }
    }

    dowloadDocument(id) {
        this.documentService.download(id).subscribe(data => {
        });
    }

    fullHSMT() {
        const that = this;
        this.confirmationService.confirm('Bạn có chắc chắn muốn chuyển trạng thái đã có HSMT?', () => {
            this.spinner.show();
            this.opportunityHsmtService.daDuHSMT(this.packageId)
                .subscribe(data => {
                    that.spinner.hide();
                    that.router.navigate([`/package/detail/${this.packageId}/invitation/full-file`]);
                    that.alertService.success('Đã chuyển sang trang thái đã có HSMT thành công!');
                });
        });
    }
}
