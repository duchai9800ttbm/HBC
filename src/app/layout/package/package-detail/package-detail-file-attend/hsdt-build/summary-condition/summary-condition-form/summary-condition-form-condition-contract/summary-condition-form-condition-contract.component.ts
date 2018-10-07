import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import DateTimeConvertHelper from '../../../../../../../../shared/helpers/datetime-convert-helper';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { DienGiaiDieuKienHopDong } from '../../../../../../../../shared/models/ho-so-du-thau/dien-giai-yeu-cau';

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
            if (!objDataStepConditionContract) {
                this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc = [];
                this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemMayMoc = [];
            }
        });
    }

    createForm() {

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

}
