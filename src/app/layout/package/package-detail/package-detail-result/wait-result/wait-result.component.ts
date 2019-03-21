import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { AlertService } from '../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageSuccessService } from '../../../../../shared/services/package-success.service';
import { PagedResult } from '../../../../../shared/models/paging-result.model';
import { Subject, Subscription } from '../../../../../../../node_modules/rxjs';
import { CancelItem } from '../../../../../shared/models/reason/cancel-item';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import { SETTING_REASON } from '../../../../../shared/configs/common.config';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
// tslint:disable-next-line:max-line-length
import { UploadResultAttendComponent } from './upload-result-attend/upload-result-attend.component';
import { PackageService } from '../../../../../shared/services/package.service';
import { CheckStatusPackage } from '../../../../../shared/constants/check-status-package';
import { PermissionModel } from '../../../../../shared/models/permission/Permission.model';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { ThanksLetterComponent } from './thanks-letter/thanks-letter.component';
import DateTimeConvertHelper from '../../../../../shared/helpers/datetime-convert-helper';

@Component({
    selector: 'app-wait-result',
    templateUrl: './wait-result.component.html',
    styleUrls: ['./wait-result.component.scss']
})
export class WaitResultComponent implements OnInit, OnDestroy {
    reasonForm: FormGroup;
    isSubmitted: boolean;
    formErrors = {
        reasonName: '',
        receiveResultDate: ''
    };
    public pageSize = 10;
    public skip = 0;
    reasonCance: PagedResult<CancelItem> = new PagedResult<CancelItem>();
    reasonLose: PagedResult<CancelItem> = new PagedResult<CancelItem>();
    reasonWin: PagedResult<CancelItem> = new PagedResult<CancelItem>();
    reason: PagedResult<CancelItem> = new PagedResult<CancelItem>();
    dtTrigger: Subject<any> = new Subject();

    currentPackageId: number;
    modaltrungThau: BsModalRef;
    // modaltratThau: BsModalRef;
    // modalhuyThau: BsModalRef;
    modalUpload: BsModalRef;
    datePickerConfig = DATETIME_PICKER_CONFIG;
    invalidMessages: string[];
    textTrungThau: string;
    // textTratThau: string;
    // textHuyThau: string;
    // btnTrungThau: boolean;
    // btnTratThau: boolean;
    // btnHuyThau: boolean;
    packageId: number;
    formUpload: FormGroup;
    submitted = false;
    modalRef: BsModalRef;
    dialogUploadResultAttend;
    dialogUploadThanksLetter;
    checkStatusPackage = CheckStatusPackage;


    listPermission: Array<PermissionModel>;
    listPermissionScreen = [];
    ChonKQDT = false;
    UploadKQDT = false;
    TaiXuongKQDT = false;
    TaiTemplate = false;
    XoaKQDT = false;
    ThongBaoDenPhongHopDong = false;
    XemEmailPhanHoi = false;
    ThongBaoStakeholders = false;
    XemMailThongBaoTrungThau = false;
    ChuyenGiaoTaiLieu = false;
    XemMailChuyenGiao = false;
    subscription: Subscription;
    constructor(
        private modalService: BsModalService,
        private router: Router,
        private activetedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private spinner: NgxSpinnerService,
        private packageSuccessService: PackageSuccessService,
        private dialogService: DialogService,
        private packageService: PackageService,
        private permissionService: PermissionService
    ) { }

    ngOnInit() {
        this.reasonForm = this.formBuilder.group({
            reasonName: ['', Validators.required],
            receiveResultDate: ['', Validators.required],
        });
        this.reasonForm.valueChanges.subscribe(data => {
            this.onFormValueChanged(data);
        });
        this.formUpload = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            createDate: [''],
            userId: [null],
            version: [''],
            interview: ['']
        });

        this.currentPackageId = +PackageDetailComponent.packageId;

        this.subscription = this.permissionService.get().subscribe(data => {
            this.listPermission = data;
            const hsdt = this.listPermission.length &&
                this.listPermission.filter(x => x.bidOpportunityStage === 'KQDT')[0];
            if (!hsdt) {
                this.listPermissionScreen = [];
            }
            if (hsdt) {
                const screen = hsdt.userPermissionDetails.length
                    && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'KetQuaDuThau')[0];
                if (!screen) {
                    this.listPermissionScreen = [];
                }
                if (screen) {
                    this.listPermissionScreen = screen.permissions.map(z => z.value);
                }
            }
            this.ChonKQDT = this.listPermissionScreen.includes('ChonKQDT');
        });

        this.spinner.show();
        this.packageSuccessService.getReasonCancel(0, 10).subscribe(
            result => {
                this.reasonCance = result;
                this.spinner.hide();
            },
            err => {
                this.spinner.hide();
            }
        );

        this.packageSuccessService.getReasonLose(0, 10).subscribe(
            result => {
                this.reasonLose = result;
                this.spinner.hide();
            },
            err => {
                this.alertService.error(`Yêu cầu danh sách lý do trật thầu thất bại. Xin vui lòng thử lại!`);
                this.spinner.hide();
            }
        );

        this.packageSuccessService.getReasonWin(0, 10).subscribe(
            result => {
                this.reasonWin = result;
                this.spinner.hide();
            },
            err => {
                this.spinner.hide();
            }
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    modalTrungThau(template: TemplateRef<any>, type: string) {
        this.modaltrungThau = this.modalService.show(template, { class: 'gray modal-lg' });
        this.textTrungThau = type;
        switch (this.textTrungThau) {
            case 'trúng':
                this.reason = this.reasonWin;
                break;
            case 'trật':
                this.reason = this.reasonLose;
                break;
            case 'hủy':
                this.reason = this.reasonCance;
                break;
        }
    }

    closeModel() {
        this.isSubmitted = false;
        this.modaltrungThau.hide();
    }

    submitForm(template: TemplateRef<any>) {
        this.isSubmitted = true;
        const valid = this.validateForm();
        if ( DateTimeConvertHelper.fromDtObjectToTimestamp(this.reasonForm.get('receiveResultDate').value) <= 0) {
            this.formErrors.receiveResultDate = 'Bạn vui lòng chọn thời gian hợp lệ';
            return;
        } else {
            this.formErrors.receiveResultDate = '';
        }
        if (this.validateForm()) {
            this.spinner.show();
            let typeBid = null;
            switch (this.textTrungThau) {
                case 'trúng':
                    typeBid = SETTING_REASON.Win;
                    break;
                case 'trật':
                    typeBid = SETTING_REASON.Lose;
                    break;
                case 'hủy':
                    typeBid = SETTING_REASON.Cancel;
                    break;
            }
            this.packageSuccessService.receiveBidResult(this.currentPackageId).subscribe(response => {
                this.packageService.changeStatusPackageValue(this.checkStatusPackage.KetQuaDuThau.text);
                this.getAPIWinOrRLoseOrReject(typeBid);
            }, err => {
                this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
                    if (result.stageStatus) {
                        if (result.stageStatus.id === this.checkStatusPackage.KetQuaDuThau.text) {
                            this.getAPIWinOrRLoseOrReject(typeBid);
                        } else {
                            this.modaltrungThau.hide();
                            this.alertService.error('Đã xảy ra lỗi!');
                        }
                    }
                });
                this.modaltrungThau.hide();
                this.spinner.hide();
                this.alertService.error('Đã xảy ra lỗi!');
            });
        }
    }

    getAPIWinOrRLoseOrReject(typeBid) {
        this.packageSuccessService.sendBidResult(
            this.currentPackageId,
            Number(this.reasonForm.get('reasonName').value),
            typeBid,
            this.reasonForm.get('receiveResultDate').value)
            .subscribe(data => {
                this.modaltrungThau.hide();
                this.alertService.success(`Gửi lý do ${this.textTrungThau} thầu thành công!`);
                switch (typeBid) {
                    case 'win': {
                        this.dialogUploadResultAttend = this.dialogService.open({
                            content: UploadResultAttendComponent,
                            width: 650,
                            minWidth: 250
                        });
                        const instance = this.dialogUploadResultAttend.content.instance;
                        instance.callBack = () => this.closePopuup(typeBid);
                        instance.callBackAndNavigate = () => this.closePopuupNevigate(typeBid);
                        instance.typeBid = typeBid;
                        instance.interviewTimes = 1;
                        instance.winOrLost = true;
                        break;
                    }
                    case 'lose': {
                        this.dialogUploadResultAttend = this.dialogService.open({
                            content: UploadResultAttendComponent,
                            width: 650,
                            minWidth: 250
                        });
                        const instance = this.dialogUploadResultAttend.content.instance;
                        instance.callBack = () => this.closePopuup(typeBid);
                        instance.callBackAndNavigate = () => this.closePopuupNevigate(typeBid);
                        instance.typeBid = typeBid;
                        instance.interviewTimes = 1;
                        instance.winOrLost = false;
                        break;
                    }
                    case 'cancel': {
                        this.dialogUploadThanksLetter = this.dialogService.open({
                            content: ThanksLetterComponent,
                            width: 650,
                            minWidth: 250
                        });
                        const instance = this.dialogUploadThanksLetter.content.instance;
                        instance.callBack = () => this.closePopuup(typeBid);
                        instance.callBackAndNavigate = () => this.closePopuupNevigate(typeBid);
                        // instance.interviewTimes = 1;
                    }
                }
                this.spinner.hide();
            }, err => {
                this.modaltrungThau.hide();
                this.alertService.error(`Gửi lý do ${this.textTrungThau} thầu thất bại!`);
                this.spinner.hide();
            });
    }

    closePopuup(typeBid) {
        switch (typeBid) {
            case 'win':
            case 'lose': {
                this.dialogUploadResultAttend.close();
                break;
            }
            case 'cancel': {
                this.dialogUploadThanksLetter.close();
                break;
            }
        }
    }

    closePopuupNevigate(typeBid) {
        switch (typeBid) {
            case 'win': {
                this.dialogUploadResultAttend.close();
                this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-success`]);
                break;
            }
            case 'lose': {
                this.dialogUploadResultAttend.close();
                this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-failed`]);
                break;
            }
            case 'cancel': {
                this.dialogUploadThanksLetter.close();
                this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-cancel`]);
                break;
            }
        }
    }

    validateForm() {
        this.invalidMessages = ValidationHelper.getInvalidMessages(
            this.reasonForm,
            this.formErrors
        );
        return this.invalidMessages.length === 0;
    }
    onFormValueChanged(data?: any) {
        if (this.isSubmitted) {
            this.validateForm();
        }
    }

    get f() {
        return this.formUpload.controls;
    }
    onSubmit() {
        this.submitted = true;
        if (this.formUpload.invalid) {
            return;
        }
        this.spinner.show();
        this.router.navigate([
            `/package/detail/${this.currentPackageId}/result/package-success`
        ]);
        this.spinner.hide();
        this.alertService.success('Upload kết quả dự thầu thành công!');
    }
    // refesh() {
    // }
}
