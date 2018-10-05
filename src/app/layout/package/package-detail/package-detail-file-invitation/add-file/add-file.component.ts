import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../../router.animations';
import { DictionaryItem, PagedResult, DictionaryItemHightLight } from '../../../../../shared/models';
import { DATATABLE_CONFIG, DATATABLE_CONFIG2 } from '../../../../../shared/configs';
import { Subject } from '../../../../../../../node_modules/rxjs/Subject';
import { AlertService, ConfirmationService, UserService, DataService } from '../../../../../shared/services';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { PackageDetailComponent } from '../../package-detail.component';
import { DocumentService } from '../../../../../shared/services/document.service';
import { BidDocumentModel } from '../../../../../shared/models/document/bid-document.model';
import { BidDocumentGroupModel } from '../../../../../shared/models/document/bid-document-group.model';
import { UserModel } from '../../../../../shared/models/user/user.model';
import { BidDocumentFilter } from '../../../../../shared/models/document/bid-document-filter.model';
import { OpportunityHsmtService } from '../../../../../shared/services/opportunity-hsmt.service';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { forEach } from '../../../../../../../node_modules/@angular/router/src/utils/collection';
@Component({
    selector: 'app-add-file',
    templateUrl: './add-file.component.html',
    styleUrls: ['./add-file.component.scss'],
    animations: [routerTransition()]
})
export class AddFileComponent implements OnInit {
    isShowMenu = false;

    checkboxSeclectAll: boolean;
    dtOptions: any = DATATABLE_CONFIG2;
    dtTrigger: Subject<any> = new Subject();
    filterModel = new BidDocumentFilter();
    searchTerm;
    pagedResultUser: PagedResult<UserModel> = new PagedResult<UserModel>();
    datePickerConfig = DATETIME_PICKER_CONFIG;
    packageId;
    showPopupAdd = false;
    showPopupDetail = false;

    typeFileUpload = {
        id: '2',
        text: 'Quyển HSMT',
    };
    currentItem = {};
    userListItem: UserItemModel[];
    ListItem: BidDocumentModel[];
    majorTypeListItem: DictionaryItemHightLight[];
    bidDocumentGroupListItem: BidDocumentGroupModel[];
    bidDocumentGroupListItemSearchResult: BidDocumentGroupModel[];
    packageData: PackageInfoModel;
    tableEmpty: boolean;
    currentMajorTypeId = 1;
    currentMajorTypeText = '';
    sum = 0;
    showTable = false;
    get titleStr() {
        if (this.majorTypeListItem && this.majorTypeListItem.length > 0) {
            return this.majorTypeListItem.find(i => i.id === this.currentMajorTypeId).text;
        }
    }
    constructor(
        private alertService: AlertService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private documentService: DocumentService,
        private userService: UserService,
        private opportunityHsmtService: OpportunityHsmtService,
        private packageService: PackageService,
        private dataService: DataService
    ) {
    }
    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;
        this.packageService.getInforPackageID(this.packageId).subscribe(result => {
            this.packageData = result;
            switch (this.packageData.hsmtStatus.id) {
                case 'DaDuHSMT': {
                    this.router.navigate([`/package/detail/${this.packageId}/invitation/full-file`]);
                    break;
                }
                default: {
                    break;
                }
            }
        });
        // config
        window.scrollTo(0, 0);
        this.dtOptions = DATATABLE_CONFIG;
        // initFilterModel
        this.filterModel.status = '';
        this.filterModel.uploadedEmployeeId = null;
        // danh sách người upload (lấy từ danh sách user)
        this.userService.getAllUser('').subscribe(data => {
            this.userListItem = data;
        });
        this.spinner.show();
        this.documentService.bidDocumentMajortypes().subscribe(data => {
            this.majorTypeListItem = data;
            this.currentMajorTypeId = this.majorTypeListItem[0].id;
            this.documentService.read(this.packageId, this.currentMajorTypeId).subscribe(response => {
                console.log(response);
                // this.documentService.getListBiddocumenttypes().subscribe( response => {
                    // biddocumenttypes.forEach((item, index) => {
                    //     response.forEach(elemnet => {
                    //         if (elemnet.documentType === item.text) {
                    //             elemnet['id'] = index;
                    //         }
                    //     });
                    //     if (index === 4) {
                    //         return;
                    //     }
                    // });
                    // response.sort(function (a, b) {
                    //     return a.id - b.id;
                    // });
                    this.bidDocumentGroupListItem = response;
                    this.bidDocumentGroupListItemSearchResult = response;
                    this.showTable = this.bidDocumentGroupListItemSearchResult.length > 0;
                    this.checkHightLight();
                    this.dtTrigger.next();
                    this.spinner.hide();
            }, err => this.spinner.hide());
        });
    }


    checkHightLight() {
        if (this.majorTypeListItem && this.majorTypeListItem.length) {
            this.majorTypeListItem.forEach(element => {
                this.documentService.read(this.packageId, element.id).subscribe(data => {
                    element.hightLight = data.length > 0;
                });
            });
        }
    }
    toggleClick() {
        this.isShowMenu = !this.isShowMenu;
        $('.toggle-menu-item').toggleClass('resize');
        $('.line').toggleClass('resize');
        $('#toggle-menu-item').toggleClass('hidden');
        $('#toggle-menu-item').toggleClass('resize');
        $('.iconN1').toggleClass('iconN01');
        $('.iconN2').toggleClass('iconN02');
        $('.iconN3').toggleClass('iconN03');
    }
    search(value) {
        this.searchTerm = value;
        this.bidDocumentGroupListItemSearchResult = this.documentService
            .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
        this.showTable = this.bidDocumentGroupListItemSearchResult.length > 0;
        this.dtTrigger.next();
    }

    filter() {
        this.bidDocumentGroupListItemSearchResult = this.documentService
            .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
        this.showTable = this.bidDocumentGroupListItemSearchResult.length > 0;
        this.dtTrigger.next();
    }

    clearFilter() {
        this.filterModel = new BidDocumentFilter();
        this.filterModel.status = '';
        this.filterModel.uploadedEmployeeId = null;
        this.bidDocumentGroupListItemSearchResult = this.documentService
            .filter(this.searchTerm, this.filterModel, this.bidDocumentGroupListItem);
        this.showTable = this.bidDocumentGroupListItemSearchResult.length > 0;

        this.dtTrigger.next();
    }
    viewDetail(item) {
        this.currentItem = item;
        console.log(item);
        this.showPopupDetail = true;
    }
    uploadHSMT() {
        this.typeFileUpload = {
            id: `${this.currentMajorTypeId}`,
            text: this.currentMajorTypeText
        };
        this.showPopupAdd = true;
    }
// TODO: FIX HARD CODE
    openPopupUploadFile(documentType) {
        if (documentType === '2') {
            this.typeFileUpload = {
                id: '2',
                text: 'Quyển HSMT',
            };
        } else if (documentType === '3') {
            this.typeFileUpload = {
                id: '3',
                text: 'Bản vẽ thuyết minh',
            };
        } else if (documentType === '4') {
            this.typeFileUpload = {
                id: '4',
                text: 'BOQ',
            };
        } else if (documentType === '5') {
            this.typeFileUpload = {
                id: '5',
                text: 'Tiêu chí kỹ thuật (Specs)',
            };
        } else if (documentType === '6') {
            this.typeFileUpload = {
                id: '6',
                text: 'Các báo cáo và các tài liệu kỹ thuật (KSDQ)',
            };
        }
        this.showPopupAdd = true;
    }

    uploadFileItem(documentType) {
        if (documentType === 'Quyển HSMT') {
            this.typeFileUpload = {
                id: '2',
                text: 'Quyển HSMT',
            };
        } else if (documentType === 'Bản vẽ thuyết minh') {
            this.typeFileUpload = {
                id: '3',
                text: 'Bản vẽ thuyết minh',
            };
        } else if (documentType === 'BOQ') {
            this.typeFileUpload = {
                id: '4',
                text: 'BOQ',
            };
        } else if (documentType === 'Tiêu chí kĩ thuật (Specs)') {
            this.typeFileUpload = {
                id: '5',
                text: 'Tiêu chí kỹ thuật (Specs)',
            };
        } else if (documentType === 'Các báo cáo và các tài liệu khác (KSDQ)') {
            this.typeFileUpload = {
                id: '6',
                text: 'Các báo cáo và các tài liệu khác (KSDQ)',
            };
        }
        this.showPopupAdd = true;
    }

    closePopup(params) {
        this.showPopupAdd = false;
        this.spinner.show();
        this.documentService.read(this.packageId, this.currentMajorTypeId).subscribe(response => {
            this.bidDocumentGroupListItem = response;
            this.bidDocumentGroupListItemSearchResult = response;
            this.showTable = this.bidDocumentGroupListItemSearchResult.length > 0;
            this.checkHightLight();
            this.dtTrigger.next();
            this.spinner.hide();
        });
    }
    closePopupDetail() {
        this.showPopupDetail = false;
    }

    refresh(): void {
        this.spinner.show();
        this.documentService.read(this.packageId, this.currentMajorTypeId).subscribe(response => {
            this.bidDocumentGroupListItem = response;
            this.bidDocumentGroupListItemSearchResult = response;
            this.showTable = this.bidDocumentGroupListItemSearchResult.length > 0;
            this.checkHightLight();
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

                        if (err.json().errorCode === 'BusinessException') {
                            that.alertService.error(`${err.json().errorMessage}!`);
                        } else {
                            that.alertService.error('Chuyển đánh giá không thành công. Bạn vui lòng kiểm tra lại!');
                        }
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
            this.sum = k + 1;
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
            this.sum = dem + k + 1;
            return dem + k + 1;
        }
    }

    changeStatus(id, status, type) {
        if (status === 'Draft') {
            this.documentService.updateStatus(id, 'Official').subscribe(data => {
                this.documentService.read(this.packageId, this.currentMajorTypeId).subscribe(response => {
                    this.bidDocumentGroupListItem = response;
                    this.bidDocumentGroupListItemSearchResult = response;
                    this.showTable = this.bidDocumentGroupListItemSearchResult.length > 0;
                    this.checkHightLight();
                    this.dtTrigger.next();
                    this.spinner.hide();
                    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
                });
            });

        }
        if (status === 'Official') {
            this.documentService.updateStatus(id, 'Draft').subscribe(data => {
                this.documentService.read(this.packageId, this.currentMajorTypeId).subscribe(response => {
                    this.bidDocumentGroupListItem = response;
                    this.bidDocumentGroupListItemSearchResult = response;
                    this.showTable = this.bidDocumentGroupListItemSearchResult.length > 0;

                    this.dtTrigger.next();
                    this.spinner.hide();
                    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
                });
            });

        }
    }


    deleteDocument(id) {
        const that = this;
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa tài liệu này?',
            () => {
                this.documentService.delete(id).subscribe(data => {
                    that.alertService.success('Đã xóa tài liệu!');
                    that.refresh();
                }, err => this.spinner.hide());
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
        }, err => {
            if (err.json().errorCode) {
                this.alertService.error('File không tồn tại hoặc đã bị xóa!');
            } else {
                this.alertService.error('Đã có lỗi xãy ra!');
            }
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
                }, err => {
                    this.spinner.hide();
                    if (err.json().errorCode === 'BusinessException') {
                        that.alertService.error('Không có tài liệu trong các bộ hồ sơ mời thầu!');
                    } else {
                        that.alertService.error('Chuyển sang trạng thái đã có HSMT thất bại!');
                    }
                });
        });
    }

    filterMajorTypeListItem(id, text) {
        this.currentMajorTypeId = id;
        this.currentMajorTypeText = text;
        this.documentService.read(this.packageId, this.currentMajorTypeId).subscribe(response => {
            this.bidDocumentGroupListItem = response;
            this.bidDocumentGroupListItemSearchResult = response;
            this.showTable = this.bidDocumentGroupListItemSearchResult.length > 0;
            this.dtTrigger.next();
            this.spinner.hide();
        }, err => this.spinner.hide());
    }
}
