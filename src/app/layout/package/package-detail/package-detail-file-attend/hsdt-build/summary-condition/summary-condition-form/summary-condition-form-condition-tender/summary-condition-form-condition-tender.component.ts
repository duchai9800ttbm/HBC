import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import DateTimeConvertHelper from '../../../../../../../../shared/helpers/datetime-convert-helper';
import { DienGiaiDieuKienHSMT } from '../../../../../../../../shared/models/ho-so-du-thau/dien-giai-yeu-cau';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { DictionaryItemText } from '../../../../../../../../shared/models';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { PackageService } from '../../../../../../../../shared/services/package.service';
import { ProposeTenderParticipateRequest } from '../../../../../../../../shared/models/api-request/package/propose-tender-participate-request';
import { Currency } from '../../../../../../../../shared/models/currency';
import { Router } from '../../../../../../../../../../node_modules/@angular/router';

@Component({
    selector: 'app-summary-condition-form-condition-tender',
    templateUrl: './summary-condition-form-condition-tender.component.html',
    styleUrls: ['./summary-condition-form-condition-tender.component.scss']
})
export class SummaryConditionFormConditionTenderComponent implements OnInit {
    dieuKienHSMTForm: FormGroup;
    dienGiaiDieuKienHSMT = new DienGiaiDieuKienHSMT();
    isModeView = false;
    isShowInputBox = false;
    dataPTPReport: ProposeTenderParticipateRequest;
    unitGiatri: Currency;
    unitTime: Currency;
    bidOpportunityId: number;
    constructor(
        private fb: FormBuilder,
        private hoSoDuThauService: HoSoDuThauService,
        private router: Router,
    ) { }

    get cacLoaiThueHSMTFA(): FormArray {
        return (this.dieuKienHSMTForm.get('theoHSMT') as FormGroup).controls.cacLoaiThue as FormArray;
    }
    ngOnInit() {
        this.bidOpportunityId = PackageDetailComponent.packageId;
        this.dataPTPReport = this.hoSoDuThauService.getDataProposedTender();
        this.hoSoDuThauService.watchLiveformState().subscribe(data => {
            this.isModeView = data.isModeView;
        });
        this.loadData();
    }

    createForm() {
        this.dieuKienHSMTForm = this.fb.group({
            theoHSMT: this.fb.group({
                giaTri: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHSMT
                        && this.dienGiaiDieuKienHSMT.theoHSMT.baoLanhDuThau
                        && this.dienGiaiDieuKienHSMT.theoHSMT.baoLanhDuThau.giaTri,
                    disabled: this.isModeView
                },
                hieuLuc: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHSMT
                        && this.dienGiaiDieuKienHSMT.theoHSMT.baoLanhDuThau
                        && this.dienGiaiDieuKienHSMT.theoHSMT.baoLanhDuThau.hieuLuc,
                    disabled: this.isModeView
                },
                hieuLucHoSo: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHSMT
                        && this.dienGiaiDieuKienHSMT.theoHSMT.hieuLucHoSo,
                    disabled: this.isModeView
                },
                ngayKhoiCong: {
                    value: DateTimeConvertHelper.fromTimestampToDtObject(this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHSMT
                        && this.dienGiaiDieuKienHSMT.theoHSMT.tienDo
                        && this.dienGiaiDieuKienHSMT.theoHSMT.tienDo.ngayKhoiCong * 1000),
                    disabled: this.isModeView
                },
                thoiGianHoanThanh: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHSMT
                        && this.dienGiaiDieuKienHSMT.theoHSMT.tienDo
                        && this.dienGiaiDieuKienHSMT.theoHSMT.tienDo.thoiGianHoanThanh,
                    disabled: this.isModeView
                },
                thoiGianHoanThanhTheoNhaThau: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHSMT
                        && this.dienGiaiDieuKienHSMT.theoHSMT.tienDo
                        && this.dienGiaiDieuKienHSMT.theoHSMT.tienDo.thoiGianHoanThanhTheoNhaThau,
                    disabled: this.isModeView
                },
                thoiGianHoanThanhTheoNhaThauCount: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHSMT
                        && this.dienGiaiDieuKienHSMT.theoHSMT.tienDo
                        && this.dienGiaiDieuKienHSMT.theoHSMT.tienDo.thoiGianHoanThanhTheoNhaThauCount,
                    disabled: this.isModeView
                },
                cacLoaiThue: this.fb.array([]),
                donViTienTe: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHSMT
                        && this.dienGiaiDieuKienHSMT.theoHSMT.donViTienTe,
                    disabled: this.isModeView
                }
            }),
            theoHBC: this.fb.group({
                giaTri: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHBC
                        && this.dienGiaiDieuKienHSMT.theoHBC.baoLanhDuThau
                        && this.dienGiaiDieuKienHSMT.theoHBC.baoLanhDuThau.giaTri,
                    disabled: this.isModeView
                },
                hieuLuc: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHBC
                        && this.dienGiaiDieuKienHSMT.theoHBC.baoLanhDuThau
                        && this.dienGiaiDieuKienHSMT.theoHBC.baoLanhDuThau.hieuLuc,
                    disabled: this.isModeView
                },
                hieuLucHoSo: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHBC
                        && this.dienGiaiDieuKienHSMT.theoHBC.hieuLucHoSo,
                    disabled: this.isModeView
                },
                ngayKhoiCong: {
                    value: DateTimeConvertHelper.fromTimestampToDtObject(this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHBC
                        && this.dienGiaiDieuKienHSMT.theoHBC.tienDo
                        && this.dienGiaiDieuKienHSMT.theoHBC.tienDo.ngayKhoiCong * 1000),
                    disabled: this.isModeView
                },
                thoiGianHoanThanh: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHSMT
                        && this.dienGiaiDieuKienHSMT.theoHBC.tienDo
                        && this.dienGiaiDieuKienHSMT.theoHBC.tienDo.thoiGianHoanThanh,
                    disabled: this.isModeView
                },
                cacLoaiThue: this.fb.array([]),
                donViTienTe: {
                    value: this.dienGiaiDieuKienHSMT && this.dienGiaiDieuKienHSMT.theoHBC
                        && this.dienGiaiDieuKienHSMT.theoHBC.donViTienTe,
                    disabled: this.isModeView
                }
            })
        });

        (this.dienGiaiDieuKienHSMT.theoHSMT.cacLoaiThue || []).forEach(x => {
            const control = (this.dieuKienHSMTForm.controls.theoHSMT as FormGroup).controls.cacLoaiThue as FormArray;
            control.push(this.fb.group({
                thue: { value: x, disabled: this.isModeView },
            }));
        });

        (this.dienGiaiDieuKienHSMT.theoHBC.cacLoaiThue || []).forEach(x => {
            const control = (this.dieuKienHSMTForm.controls.theoHBC as FormGroup).controls.cacLoaiThue as FormArray;
            control.push(this.fb.group({
                thue: { value: x, disabled: this.isModeView },
            }));
        });
        // Begin: Set default value
        if (this.dieuKienHSMTForm && this.dataPTPReport) {
            this.unitGiatri = this.dataPTPReport.contractCondition && this.dataPTPReport.contractCondition.tenderSecurityCurrency;
            const giaTriHSMT = this.dataPTPReport.contractCondition && this.dataPTPReport.contractCondition.tenderSecurity;
            if (giaTriHSMT) {
                this.dieuKienHSMTForm.get('theoHSMT').get('giaTri').patchValue(giaTriHSMT);
            }
            const tienDoHSMT = this.dataPTPReport.contractCondition && this.dataPTPReport.contractCondition.commencementDate;
            if (tienDoHSMT) {
                this.dieuKienHSMTForm.get('theoHSMT').get('ngayKhoiCong').patchValue(
                    DateTimeConvertHelper.fromTimestampToDtObject(tienDoHSMT * 1000)
                );
            }
            this.unitTime = this.dataPTPReport.contractCondition && this.dataPTPReport.contractCondition.timeForCompletionUnit;
            const tienDoHoanThanhHSMT = this.dataPTPReport.contractCondition && this.dataPTPReport.contractCondition.timeForCompletion;
            if (tienDoHoanThanhHSMT) {
                this.dieuKienHSMTForm.get('theoHSMT').get('thoiGianHoanThanh').patchValue(tienDoHoanThanhHSMT);
            }

        }
        // End: Set default value

        this.dieuKienHSMTForm.valueChanges.subscribe(data => {
            let obj = new DienGiaiDieuKienHSMT();
            obj = {
                theoHSMT: {
                    baoLanhDuThau: {
                        giaTri: (data.theoHSMT.giaTri) ? data.theoHSMT.giaTri : 0,
                        hieuLuc: data.theoHSMT.hieuLuc
                    },
                    hieuLucHoSo: data.theoHSMT.hieuLucHoSo,
                    tienDo: {
                        ngayKhoiCong: DateTimeConvertHelper.fromDtObjectToTimestamp(data.theoHSMT.ngayKhoiCong),
                        thoiGianHoanThanh: String(data.theoHSMT.thoiGianHoanThanh) + ' ' + this.unitTime.value,
                        thoiGianHoanThanhTheoNhaThau: (data.theoHSMT.thoiGianHoanThanhTheoNhaThau) ?
                            data.theoHSMT.thoiGianHoanThanhTheoNhaThau : false,
                        thoiGianHoanThanhTheoNhaThauCount:
                            String(data.theoHSMT.thoiGianHoanThanhTheoNhaThauCount) + ' ' + this.unitTime.value
                    },
                    cacLoaiThue: (data.theoHSMT.cacLoaiThue || []).map(x => x.thue),
                    donViTienTe: data.theoHSMT.donViTienTe
                },
                theoHBC: {
                    baoLanhDuThau: {
                        giaTri: (data.theoHBC.giaTri) ? data.theoHBC.giaTri : 0,
                        hieuLuc: data.theoHBC.hieuLuc
                    },
                    hieuLucHoSo: data.theoHBC.hieuLucHoSo,
                    tienDo: {
                        ngayKhoiCong: DateTimeConvertHelper.fromDtObjectToTimestamp(data.theoHBC.ngayKhoiCong),
                        thoiGianHoanThanh: String(data.theoHBC.thoiGianHoanThanh) + ' ' + this.unitTime.value,
                        thoiGianHoanThanhTheoNhaThau: null,
                        thoiGianHoanThanhTheoNhaThauCount: null
                    },
                    cacLoaiThue: (data.theoHBC.cacLoaiThue || []).map(x => x.thue),
                    donViTienTe: data.theoHBC.donViTienTe
                }
            };
            this.hoSoDuThauService.emitDataStepConditionTender(obj);
        });
    }

    loadData() {
        this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
            const obj = data.dienGiaiDieuKienHSMT;
            if (obj) {
                this.dienGiaiDieuKienHSMT = {
                    theoHBC: obj.theoHBC ? obj.theoHBC : {
                        baoLanhDuThau: {
                            giaTri: null,
                            hieuLuc: '',
                        },
                        hieuLucHoSo: '',
                        tienDo: {
                            ngayKhoiCong: null,
                            thoiGianHoanThanh: null,
                            thoiGianHoanThanhTheoNhaThau: null,
                            thoiGianHoanThanhTheoNhaThauCount: null
                        },
                        cacLoaiThue: [''],
                        donViTienTe: ''
                    },
                    theoHSMT: obj.theoHSMT ? obj.theoHSMT : {
                        baoLanhDuThau: {
                            giaTri: null,
                            hieuLuc: '',
                        },
                        hieuLucHoSo: '',
                        tienDo: {
                            ngayKhoiCong: null,
                            thoiGianHoanThanh: null,
                            thoiGianHoanThanhTheoNhaThau: null,
                            thoiGianHoanThanhTheoNhaThauCount: null
                        },
                        cacLoaiThue: [''],
                        donViTienTe: ''
                    }
                };

                if (this.dienGiaiDieuKienHSMT.theoHSMT.cacLoaiThue.length === 0) {
                    this.dienGiaiDieuKienHSMT.theoHSMT.cacLoaiThue = [''];
                }
                if (this.dienGiaiDieuKienHSMT.theoHBC.cacLoaiThue.length === 0) {
                    this.dienGiaiDieuKienHSMT.theoHBC.cacLoaiThue = [''];
                }
                this.isShowInputBox = obj.theoHSMT && obj.theoHSMT.tienDo && obj.theoHSMT.tienDo.thoiGianHoanThanhTheoNhaThau;
            }
            if (!obj) {
                this.dienGiaiDieuKienHSMT = {
                    theoHSMT: {
                        baoLanhDuThau: {
                            giaTri: null,
                            hieuLuc: '',
                        },
                        hieuLucHoSo: '',
                        tienDo: {
                            ngayKhoiCong: null,
                            thoiGianHoanThanh: null,
                            thoiGianHoanThanhTheoNhaThau: null,
                            thoiGianHoanThanhTheoNhaThauCount: null
                        },
                        cacLoaiThue: [''],
                        donViTienTe: ''
                    },
                    theoHBC: {
                        baoLanhDuThau: {
                            giaTri: null,
                            hieuLuc: '',
                        },
                        hieuLucHoSo: '',
                        tienDo: {
                            ngayKhoiCong: null,
                            thoiGianHoanThanh: null,
                            thoiGianHoanThanhTheoNhaThau: null,
                            thoiGianHoanThanhTheoNhaThauCount: null
                        },
                        cacLoaiThue: [''],
                        donViTienTe: ''
                    }
                };
            }
            this.createForm();
        });
    }



    addFormArrayControl(name: string, data?: DictionaryItemText) {
        const formArray = (this.dieuKienHSMTForm.get('theoHSMT') as FormGroup).controls.cacLoaiThue as FormArray;
        const formItem = this.fb.group({
            thue: { value: '', disabled: this.isModeView }
        });
        formArray.push(formItem);
    }

    removeFormArrayControl(name: string, idx: number) {
        const formArray = (this.dieuKienHSMTForm.get('theoHSMT') as FormGroup).controls.cacLoaiThue as FormArray;
        formArray.removeAt(idx);
    }
    chooseRadio(choose: string) {
        if (choose === 'yes') {
            this.dieuKienHSMTForm.get('theoHSMT').get('thoiGianHoanThanhTheoNhaThau').patchValue(true);
            this.isShowInputBox = this.dieuKienHSMTForm.get('theoHSMT').get('thoiGianHoanThanhTheoNhaThau').value;
        }
        if (choose === 'no') {
            this.dieuKienHSMTForm.get('theoHSMT').get('thoiGianHoanThanhTheoNhaThau').patchValue(false);
            this.dieuKienHSMTForm.get('theoHSMT').get('thoiGianHoanThanhTheoNhaThauCount').patchValue('');
            this.isShowInputBox = this.dieuKienHSMTForm.get('theoHSMT').get('thoiGianHoanThanhTheoNhaThau').value;
        }
    }

    routerLink(e, link) {
        if (e.code === 'Enter') {
            this.router.navigate([`/package/detail/${this.bidOpportunityId}/attend/build/summary/form/create/${link}`]);
        }
    }
}
