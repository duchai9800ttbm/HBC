import { Component, OnInit, TemplateRef } from '@angular/core';
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
import { Subject } from '../../../../../../../node_modules/rxjs';
import { CancelItem } from '../../../../../shared/models/reason/cancel-item';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import { SETTING_REASON } from '../../../../../shared/configs/common.config';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { UploadResultFileAttendComponent } from '../package-success/package-list/upload-result-file-attend/upload-result-file-attend.component';

@Component({
    selector: 'app-wait-result',
    templateUrl: './wait-result.component.html',
    styleUrls: ['./wait-result.component.scss']
})
export class WaitResultComponent implements OnInit {
    reasonForm: FormGroup;
    isSubmitted: boolean;
    formErrors = {
        reasonName: ''
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
    constructor(
        private modalService: BsModalService,
        private router: Router,
        private activetedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private spinner: NgxSpinnerService,
        private packageSuccessService: PackageSuccessService,
        private dialogService: DialogService
    ) { }

    ngOnInit() {
        this.reasonForm = this.formBuilder.group({
            reasonName: ['', Validators.required]
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

    modalTrungThau(template: TemplateRef<any>, type: string) {
        this.modaltrungThau = this.modalService.show(template);
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
        this.modaltrungThau.hide();
    }

    submitForm(template: TemplateRef<any>) {
        this.isSubmitted = true;
        const valid = this.validateForm();
        console.log('valid', valid);
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
            console.log('sendBidResult', this.currentPackageId, Number(this.reasonForm.get('reasonName').value), typeBid);
            switch (typeBid) {
                case 'win': {
                    this.dialogUploadResultAttend = this.dialogService.open({
                        content: UploadResultFileAttendComponent,
                        width: 650,
                        minWidth: 250
                    });
                    const instance = this.dialogUploadResultAttend.content.instance;
                    instance.callBack = () => this.closePopuup();
                    break;
                }
                case 'lose': {
                    this.dialogUploadResultAttend = this.dialogService.open({
                        content: UploadResultFileAttendComponent,
                        width: 650,
                        minWidth: 250
                    });
                    const instance = this.dialogUploadResultAttend.content.instance;
                    instance.callBack = () => this.closePopuup()
                    break;
                }
                case 'cancel': {
                    this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-cancel`]);
                }
            }
            this.packageSuccessService.sendBidResult(this.currentPackageId, Number(this.reasonForm.get('reasonName').value), typeBid)
                .subscribe(data => {
                    this.modaltrungThau.hide();
                    this.alertService.success(`Gửi lý do ${this.textTrungThau} thầu thành công!`);
                    this.spinner.hide();
                }, err => {
                    this.modaltrungThau.hide();
                    this.alertService.error(`Gửi lý do ${this.textTrungThau} thầu thất bại!`);
                    this.spinner.hide();
                });
        }
    }

    closePopuup() {
        this.dialogUploadResultAttend.close();
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
