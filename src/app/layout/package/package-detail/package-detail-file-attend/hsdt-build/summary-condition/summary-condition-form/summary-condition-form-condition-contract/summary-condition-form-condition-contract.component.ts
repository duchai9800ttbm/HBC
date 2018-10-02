import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import DateTimeConvertHelper from '../../../../../../../../shared/helpers/datetime-convert-helper';
import { DienGiaiDieuKienHopDong } from '../../../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';

@Component({
    selector: 'app-summary-condition-form-condition-contract',
    templateUrl: './summary-condition-form-condition-contract.component.html',
    styleUrls: ['./summary-condition-form-condition-contract.component.scss']
})
export class SummaryConditionFormConditionContractComponent implements OnInit {
    conditionContractForm: FormGroup;
    dataStepConditionContract = new DienGiaiDieuKienHopDong();

    get insurancesFA(): FormArray {
        const contractCondition = this.conditionContractForm.get('contractCondition') as FormArray;
        return contractCondition.get('insurances') as FormArray;
    }
    constructor(
        private fb: FormBuilder,
        private hoSoDuThauService: HoSoDuThauService
    ) { }

    ngOnInit() {
        this.loadData();
        this.createForm();
        this.addFormArrayControl('insurances');
        this.conditionContractForm.valueChanges.subscribe(data =>
            this.mappingToLiveFormData(data)
        );
    }

    loadData() {
        this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
            const objDataStepConditionContract = data.dienGiaiDieuKienHopDong;
            if (objDataStepConditionContract) {
                this.dataStepConditionContract.loaiHopDong = objDataStepConditionContract.loaiHopDong;
                this.dataStepConditionContract.dieuKienTheoHSMT = objDataStepConditionContract.dieuKienTheoHSMT && {
                    baoLanhThucHien: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien.phanTram,
                        hieuLuc: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien.hieuLuc
                    },
                    baoLanhTamUng: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng.phanTram,
                        hieuLuc: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng.hieuLuc
                    },
                    thanhToan: objDataStepConditionContract.dieuKienTheoHSMT.thanhToan && {
                        loaiThanhToan: objDataStepConditionContract.dieuKienTheoHSMT.thanhToan.loaiThanhToan,
                        thoiGianThanhToan: objDataStepConditionContract.dieuKienTheoHSMT.thanhToan.thoiGianThanhToan,
                        thanhToanKhiTapKet: objDataStepConditionContract.dieuKienTheoHSMT.thanhToan.thanhToanKhiTapKet
                    },
                    tienGiuLai: objDataStepConditionContract.dieuKienTheoHSMT.tienGiuLai && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.phanTram,
                        gioiHanTienGiuLai: objDataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.gioiHanTienGiuLai,
                        thanhToanTienGui: objDataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.thanhToanTienGui
                    },
                    phatTreTienDo: objDataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo.phanTram,
                        gioiHanPhatTienDo: objDataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo.gioiHanPhatTienDo
                    },
                    thoiGianBaoHanh: objDataStepConditionContract.dieuKienTheoHSMT.thoiGianBaoHanh,
                    baoHiem: objDataStepConditionContract.dieuKienTheoHSMT.baoHiem && {
                        baoHiemMayMoc: objDataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc,
                        baoHiemConNguoi: objDataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemConNguoi,
                        baoHiemCongTrinh: objDataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemCongTrinh
                    }
                };
                this.dataStepConditionContract.dieuKienTheoHBC = objDataStepConditionContract.dieuKienTheoHBC && {
                    baoLanhThucHien: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien.phanTram,
                        hieuLuc: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien.hieuLuc
                    },
                    baoLanhTamUng: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng.phanTram,
                        hieuLuc: objDataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng.hieuLuc
                    },
                    thanhToan: objDataStepConditionContract.dieuKienTheoHSMT.thanhToan && {
                        loaiThanhToan: objDataStepConditionContract.dieuKienTheoHSMT.thanhToan.loaiThanhToan,
                        thoiGianThanhToan: objDataStepConditionContract.dieuKienTheoHSMT.thanhToan.thoiGianThanhToan,
                        thanhToanKhiTapKet: objDataStepConditionContract.dieuKienTheoHSMT.thanhToan.thanhToanKhiTapKet
                    },
                    tienGiuLai: objDataStepConditionContract.dieuKienTheoHSMT.tienGiuLai && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.phanTram,
                        gioiHanTienGiuLai: objDataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.gioiHanTienGiuLai,
                        thanhToanTienGui: objDataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.thanhToanTienGui
                    },
                    phatTreTienDo: objDataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo.phanTram,
                        gioiHanPhatTienDo: objDataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo.gioiHanPhatTienDo
                    },
                    thoiGianBaoHanh: objDataStepConditionContract.dieuKienTheoHSMT.thoiGianBaoHanh,
                    baoHiem: objDataStepConditionContract.dieuKienTheoHSMT.baoHiem && {
                        baoHiemMayMoc: objDataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc,
                        baoHiemConNguoi: objDataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemConNguoi,
                        baoHiemCongTrinh: objDataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemCongTrinh
                    }
                };
            }
        });
    }

    createForm() {
        const formValue =
            SummaryConditionFormComponent.formModel.contractCondition;
        this.conditionContractForm = this.fb.group({
            contractType: formValue ? formValue.contractType : '',
            desc: formValue ? formValue.desc : '',
            contractCondition: this.fb.group({
                executiveGuaranteePercent: formValue
                    ? formValue.contractCondition.executiveGuaranteePercent
                    : 0,
                executiveGuaranteeEfficiency: formValue
                    ? DateTimeConvertHelper.fromTimestampToDtObject(
                        formValue.contractCondition
                            .executiveGuaranteeEfficiency
                    )
                    : new Date(),
                advanceGuaranteePercent: formValue
                    ? formValue.contractCondition.advanceGuaranteePercent
                    : 0,
                advanceGuaranteeEfficiency: formValue
                    ? DateTimeConvertHelper.fromTimestampToDtObject(
                        formValue.contractCondition.advanceGuaranteeEfficiency
                    )
                    : new Date(),
                paymentType: formValue
                    ? formValue.contractCondition.paymentType
                    : '',
                paymentTime: formValue
                    ? DateTimeConvertHelper.fromTimestampToDtObject(
                        formValue.contractCondition.paymentTime
                    )
                    : new Date(),
                paymentMaterialOnSite: formValue
                    ? formValue.contractCondition.paymentMaterialOnSite
                    : '',
                retainedPercent: formValue
                    ? formValue.contractCondition.retainedPercent
                    : 0,
                retainedLimit: formValue
                    ? formValue.contractCondition.retainedLimit
                    : 0,
                retainedPayment: formValue
                    ? formValue.contractCondition.retainedPayment
                    : 0,
                punishhOverduePercent: formValue
                    ? formValue.contractCondition.punishhOverduePercent
                    : 0,
                punishhOverdueLimit: formValue
                    ? formValue.contractCondition.punishhOverdueLimit
                    : 0,
                guaranteeDuration: formValue
                    ? DateTimeConvertHelper.fromTimestampToDtObject(
                        formValue.contractCondition.guaranteeDuration
                    )
                    : new Date(),
                insurranceMachineOfContractor: formValue
                    ? formValue.contractCondition.insurranceMachineOfContractor
                    : '',
                insurrancePersonOfContractor: formValue
                    ? formValue.contractCondition.insurrancePersonOfContractor
                    : '',
                insurranceConstructionAnd3rdPart: formValue
                    ? formValue.contractCondition
                        .insurranceConstructionAnd3rdPart
                    : '',
                insurances: this.fb.array([])
            })
        });
    }

    addFormArrayControl(name: string) {
        const formGroup = this.conditionContractForm.get(
            'contractCondition'
        ) as FormGroup;
        const formArray = formGroup.get(name) as FormArray;
        const formItem = this.fb.group({
            name: '',
            description: ''
        });
        formArray.push(formItem);
    }

    removeFormArrayControl(name: string, idx: number) {
        const formArray = this.conditionContractForm.get(name) as FormArray;
        formArray.removeAt(idx);
    }

    mappingToLiveFormData(data) {
        SummaryConditionFormComponent.formModel.contractCondition = data;
        // tslint:disable-next-line:max-line-length
        SummaryConditionFormComponent.formModel.contractCondition.contractCondition.executiveGuaranteeEfficiency = DateTimeConvertHelper.fromDtObjectToTimestamp(
            data.contractCondition.executiveGuaranteeEfficiency
        );
        // tslint:disable-next-line:max-line-length
        SummaryConditionFormComponent.formModel.contractCondition.contractCondition.advanceGuaranteeEfficiency = DateTimeConvertHelper.fromDtObjectToTimestamp(
            data.contractCondition.advanceGuaranteeEfficiency
        );
        // tslint:disable-next-line:max-line-length
        SummaryConditionFormComponent.formModel.contractCondition.contractCondition.paymentTime = DateTimeConvertHelper.fromDtObjectToTimestamp(
            data.contractCondition.paymentTime
        );
        // tslint:disable-next-line:max-line-length
        SummaryConditionFormComponent.formModel.contractCondition.contractCondition.guaranteeDuration = DateTimeConvertHelper.fromDtObjectToTimestamp(
            data.contractCondition.guaranteeDuration
        );
    }
}
