import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { DienGiaiDieuKienHopDong } from '../../../../../../../../shared/models/ho-so-du-thau/dien-giai-yeu-cau';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import {
    ProposeTenderParticipateRequest
} from '../../../../../../../../shared/models/api-request/package/propose-tender-participate-request';
import { Currency } from '../../../../../../../../shared/models/currency';
import { Router } from '../../../../../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../../../../../shared/services/setting.service';
import { Contract } from '../../../../../../../../shared/models/setting/contract';
import { AlertService } from '../../../../../../../../shared/services';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';

@Component({
    selector: 'app-summary-condition-form-condition-contract',
    templateUrl: './summary-condition-form-condition-contract.component.html',
    styleUrls: ['./summary-condition-form-condition-contract.component.scss']
})
export class SummaryConditionFormConditionContractComponent implements OnInit {
    conditionContractForm: FormGroup;
    dataStepConditionContract = new DienGiaiDieuKienHopDong();
    isModeView = false;
    packageId;
    listPayment = ['Theo tháng (Monthly Payment)', 'Theo giai đoạn (Milestone)'];
    // Thông tin Đề nghị dự thầu
    dataPTPReport: ProposeTenderParticipateRequest;
    unitTimeguarantee: Currency;
    typeOfContracts: Contract[];

    get baoHiemMayMocHSMTFA(): FormArray {
        const dieuKienHSMT = this.conditionContractForm.get('dieuKienTheoHSMT') as FormGroup;
        const baoHiem = dieuKienHSMT.get('baoHiem') as FormGroup;
        return baoHiem.get('baoHiemMayMoc') as FormArray;
    }

    get baoHiemMayMocHBCFA(): FormArray {
        const dieuKienHBC = this.conditionContractForm.get('dieuKienTheoHBC') as FormGroup;
        const baoHiem = dieuKienHBC.get('baoHiem') as FormGroup;
        return baoHiem.get('baoHiemMayMoc') as FormArray;
    }

    constructor(
        private fb: FormBuilder,
        private hoSoDuThauService: HoSoDuThauService,
        private router: Router,
        private settingService: SettingService,
        private alertService: AlertService,
        private parent: SummaryConditionFormComponent
    ) { }

    ngOnInit() {
        this.packageId = PackageDetailComponent.packageId;
        this.dataPTPReport = this.hoSoDuThauService.getDataProposedTender();
        this.hoSoDuThauService.watchLiveformState().subscribe(data => {
            this.isModeView = data.isModeView;
        });
        this.settingService.loadAllTypeOfContracts().subscribe(data => {
            this.typeOfContracts = data;
        }, err => this.alertService.error('Tải danh sách loại hợp đồng không thành công.'));
        this.loadData();

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
                    baoLanhThucHien: objDataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien.phanTram,
                        hieuLuc: objDataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien.hieuLuc
                    },
                    baoLanhTamUng: objDataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng.phanTram,
                        hieuLuc: objDataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng.hieuLuc
                    },
                    thanhToan: objDataStepConditionContract.dieuKienTheoHBC.thanhToan && {
                        loaiThanhToan: objDataStepConditionContract.dieuKienTheoHBC.thanhToan.loaiThanhToan,
                        thoiGianThanhToan: objDataStepConditionContract.dieuKienTheoHBC.thanhToan.thoiGianThanhToan,
                        thanhToanKhiTapKet: objDataStepConditionContract.dieuKienTheoHBC.thanhToan.thanhToanKhiTapKet
                    },
                    tienGiuLai: objDataStepConditionContract.dieuKienTheoHBC.tienGiuLai && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHBC.tienGiuLai.phanTram,
                        gioiHanTienGiuLai: objDataStepConditionContract.dieuKienTheoHBC.tienGiuLai.gioiHanTienGiuLai,
                        thanhToanTienGui: objDataStepConditionContract.dieuKienTheoHBC.tienGiuLai.thanhToanTienGui
                    },
                    phatTreTienDo: objDataStepConditionContract.dieuKienTheoHBC.phatTreTienDo && {
                        phanTram: objDataStepConditionContract.dieuKienTheoHBC.phatTreTienDo.phanTram,
                        gioiHanPhatTienDo: objDataStepConditionContract.dieuKienTheoHBC.phatTreTienDo.gioiHanPhatTienDo
                    },
                    thoiGianBaoHanh: objDataStepConditionContract.dieuKienTheoHBC.thoiGianBaoHanh,
                    baoHiem: objDataStepConditionContract.dieuKienTheoHBC.baoHiem && {
                        baoHiemMayMoc: objDataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemMayMoc,
                        baoHiemConNguoi: objDataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemConNguoi,
                        baoHiemCongTrinh: objDataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemCongTrinh
                    }
                };

                if (!this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc ||
                    this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc.length === 0) {
                    this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc = [];
                    this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc.push('');
                }
                if (!this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemMayMoc ||
                    this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemMayMoc.length === 0) {
                    this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemMayMoc = [];
                    this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemMayMoc.push('');
                }
            }
            if (!objDataStepConditionContract) {
                this.dataStepConditionContract = {
                    loaiHopDong: {
                        name: '',
                        desc: ''
                    },
                    dieuKienTheoHSMT: {
                        baoLanhThucHien: {
                            phanTram: null,
                            hieuLuc: ''
                        },
                        baoLanhTamUng: {
                            phanTram: null,
                            hieuLuc: ''
                        },
                        thanhToan: {
                            loaiThanhToan: '',
                            thoiGianThanhToan: null,
                            thanhToanKhiTapKet: ''
                        },
                        tienGiuLai: {
                            phanTram: null,
                            gioiHanTienGiuLai: null,
                            thanhToanTienGui: ''
                        },
                        phatTreTienDo: {
                            phanTram: null,
                            gioiHanPhatTienDo: null
                        },
                        thoiGianBaoHanh: null,
                        baoHiem: {
                            baoHiemMayMoc: [''],
                            baoHiemConNguoi: '',
                            baoHiemCongTrinh: ''
                        }
                    },
                    dieuKienTheoHBC: {
                        baoLanhThucHien: {
                            phanTram: null,
                            hieuLuc: ''
                        },
                        baoLanhTamUng: {
                            phanTram: null,
                            hieuLuc: ''
                        },
                        thanhToan: {
                            loaiThanhToan: '',
                            thoiGianThanhToan: null,
                            thanhToanKhiTapKet: ''
                        },
                        tienGiuLai: {
                            phanTram: null,
                            gioiHanTienGiuLai: null,
                            thanhToanTienGui: ''
                        },
                        phatTreTienDo: {
                            phanTram: null,
                            gioiHanPhatTienDo: null
                        },
                        thoiGianBaoHanh: null,
                        baoHiem: {
                            baoHiemMayMoc: [''],
                            baoHiemConNguoi: '',
                            baoHiemCongTrinh: ''
                        }
                    }
                };
            }

            this.createForm();

        });
    }

    createForm() {
        this.conditionContractForm = this.fb.group({

            loaiHopDong: this.fb.group({
                name: {
                    value: this.dataStepConditionContract && this.dataStepConditionContract.loaiHopDong
                        && (this.dataStepConditionContract.loaiHopDong.name) ? this.dataStepConditionContract.loaiHopDong.name : '',
                    disabled: this.isModeView
                },
                desc: {
                    value: this.dataStepConditionContract.loaiHopDong.desc,
                    disabled: this.isModeView
                }
            }),
            dieuKienTheoHSMT: this.fb.group({
                baoLanhThucHien: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien.phanTram,
                        disabled: this.isModeView
                    },
                    hieuLuc: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien.hieuLuc,
                        disabled: this.isModeView
                    }
                }),

                baoLanhTamUng: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng.phanTram,
                        disabled: this.isModeView
                    },
                    hieuLuc: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng.hieuLuc,
                        disabled: this.isModeView
                    }
                }),

                thanhToan: this.fb.group({
                    loaiThanhToan: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan.loaiThanhToan,
                        disabled: true
                    },
                    thoiGianThanhToan: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan.thoiGianThanhToan,
                        disabled: this.isModeView
                    },
                    thanhToanKhiTapKet: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan.thanhToanKhiTapKet,
                        disabled: this.isModeView
                    }
                }),

                tienGiuLai: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.phanTram,
                        disabled: this.isModeView
                    },
                    gioiHanTienGiuLai: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.gioiHanTienGiuLai,
                        disabled: this.isModeView
                    },
                    thanhToanTienGui: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.thanhToanTienGui,
                        disabled: this.isModeView
                    }
                }),

                phatTreTienDo: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo
                            && this.dataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo.phanTram,
                        disabled: this.isModeView
                    },
                    gioiHanPhatTienDo: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo
                            && this.dataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo.gioiHanPhatTienDo,
                        disabled: this.isModeView
                    }
                }),

                thoiGianBaoHanh: {
                    value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                        && this.dataStepConditionContract.dieuKienTheoHSMT.thoiGianBaoHanh,
                    disabled: this.isModeView
                },

                baoHiem: this.fb.group({
                    baoHiemMayMoc: this.fb.array([]),
                    baoHiemConNguoi: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemConNguoi,
                        disabled: this.isModeView
                    },
                    baoHiemCongTrinh: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemCongTrinh,
                        disabled: this.isModeView
                    }
                })
            }),
            dieuKienTheoHBC: this.fb.group({
                baoLanhThucHien: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien.phanTram,
                        disabled: this.isModeView
                    },
                    hieuLuc: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien.hieuLuc,
                        disabled: this.isModeView
                    }
                }),

                baoLanhTamUng: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng.phanTram,
                        disabled: this.isModeView
                    },
                    hieuLuc: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng.hieuLuc,
                        disabled: this.isModeView
                    }
                }),

                thanhToan: this.fb.group({
                    loaiThanhToan: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan.loaiThanhToan,
                        disabled: this.isModeView
                    },
                    thoiGianThanhToan: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan.thoiGianThanhToan,
                        disabled: this.isModeView
                    },
                    thanhToanKhiTapKet: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan.thanhToanKhiTapKet,
                        disabled: this.isModeView
                    }
                }),

                tienGiuLai: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai.phanTram,
                        disabled: this.isModeView
                    },
                    gioiHanTienGiuLai: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai.gioiHanTienGiuLai,
                        disabled: this.isModeView
                    },
                    thanhToanTienGui: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai.thanhToanTienGui,
                        disabled: this.isModeView
                    }
                }),

                phatTreTienDo: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.phatTreTienDo
                            && this.dataStepConditionContract.dieuKienTheoHBC.phatTreTienDo.phanTram,
                        disabled: this.isModeView
                    },
                    gioiHanPhatTienDo: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.phatTreTienDo
                            && this.dataStepConditionContract.dieuKienTheoHBC.phatTreTienDo.gioiHanPhatTienDo,
                        disabled: this.isModeView
                    }
                }),

                thoiGianBaoHanh: {
                    value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                        && this.dataStepConditionContract.dieuKienTheoHBC.thoiGianBaoHanh,
                    disabled: this.isModeView
                },

                baoHiem: this.fb.group({
                    baoHiemMayMoc: this.fb.array([]),
                    baoHiemConNguoi: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoHiem
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemConNguoi,
                        disabled: this.isModeView
                    },
                    baoHiemCongTrinh: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoHiem
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemCongTrinh,
                        disabled: this.isModeView
                    }
                })
            }),
        });

        this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc.forEach(x => {
            const controls = <FormArray>((this.conditionContractForm.controls.dieuKienTheoHSMT as FormGroup)
                .controls.baoHiem as FormGroup).controls.baoHiemMayMoc as FormArray;
            controls.push(this.fb.group({
                baoHiemItem: {
                    value: x,
                    disabled: this.isModeView
                }
            }));

        });

        this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemMayMoc.forEach(x => {
            const controls = <FormArray>((this.conditionContractForm.controls.dieuKienTheoHBC as FormGroup)
                .controls.baoHiem as FormGroup).controls.baoHiemMayMoc as FormArray;
            controls.push(this.fb.group({
                baoHiemItem: {
                    value: x,
                    disabled: this.isModeView
                }
            }));
        });
        // Begin: Set default value
        if (this.conditionContractForm.value && this.dataPTPReport) {
            const descLoaiHopDong = this.dataPTPReport.contractCondition && this.dataPTPReport.contractCondition.typeOfContract;
            if (descLoaiHopDong) {
                this.conditionContractForm.get('loaiHopDong').get('desc').patchValue(descLoaiHopDong);
            }
            const phanTramBaoLanhThucHienHSMT = this.dataPTPReport.contractCondition &&
                this.dataPTPReport.contractCondition.performanceSecurity;
            if (phanTramBaoLanhThucHienHSMT) {
                this.conditionContractForm
                    .get('dieuKienTheoHSMT').get('baoLanhThucHien').get('phanTram').patchValue(phanTramBaoLanhThucHienHSMT);
            }
            const phanTramBaoLanhTamUngHSMT = this.dataPTPReport.contractCondition && this.dataPTPReport.contractCondition.advancePayment;
            if (phanTramBaoLanhTamUngHSMT) {
                this.conditionContractForm
                    .get('dieuKienTheoHSMT').get('baoLanhTamUng').get('phanTram').patchValue(phanTramBaoLanhTamUngHSMT);
            }
            const loaiThanhToanHSMT = this.dataPTPReport.contractCondition &&
                this.dataPTPReport.contractCondition.monthlyPaymentOrMilestone;
            if (loaiThanhToanHSMT) {
                this.conditionContractForm
                    .get('dieuKienTheoHSMT').get('thanhToan').get('loaiThanhToan').patchValue(loaiThanhToanHSMT.value);
            }
            const phanTramTienGiuLaiHSMT = this.dataPTPReport.contractCondition && this.dataPTPReport.contractCondition.retentionMoney;
            if (phanTramTienGiuLaiHSMT) {
                this.conditionContractForm
                    .get('dieuKienTheoHSMT').get('tienGiuLai').get('phanTram').patchValue(phanTramTienGiuLaiHSMT);
            }

            this.unitTimeguarantee = this.dataPTPReport.contractCondition &&
                this.dataPTPReport.contractCondition.warrantyPeriodUnit;
            const phanTramPhatTreTienDoHSMT = this.dataPTPReport.contractCondition &&
                this.dataPTPReport.contractCondition.delayDamagesForTheWorks;
            if (phanTramPhatTreTienDoHSMT) {
                this.conditionContractForm
                    .get('dieuKienTheoHSMT').get('phatTreTienDo').get('phanTram').patchValue(phanTramPhatTreTienDoHSMT);
            }
        }
        // End: Set default value


        this.conditionContractForm.valueChanges.subscribe(data => {
            let objData = new DienGiaiDieuKienHopDong();
            objData = {
                loaiHopDong: data.loaiHopDong && {
                    name: data.loaiHopDong.name,
                    desc: data.loaiHopDong.desc
                },
                dieuKienTheoHSMT: data.dieuKienTheoHSMT && {
                    baoLanhThucHien: data.dieuKienTheoHSMT.baoLanhThucHien && {
                        phanTram: data.dieuKienTheoHSMT.baoLanhThucHien.phanTram,
                        hieuLuc: data.dieuKienTheoHSMT.baoLanhThucHien.hieuLuc
                    },
                    baoLanhTamUng: data.dieuKienTheoHSMT.baoLanhTamUng && {
                        phanTram: data.dieuKienTheoHSMT.baoLanhTamUng.phanTram,
                        hieuLuc: data.dieuKienTheoHSMT.baoLanhTamUng.hieuLuc
                    },
                    thanhToan: data.dieuKienTheoHSMT.thanhToan && {
                        loaiThanhToan: data.dieuKienTheoHSMT.thanhToan.loaiThanhToan,
                        thoiGianThanhToan: data.dieuKienTheoHSMT.thanhToan.thoiGianThanhToan,
                        thanhToanKhiTapKet: data.dieuKienTheoHSMT.thanhToan.thanhToanKhiTapKet
                    },
                    tienGiuLai: data.dieuKienTheoHSMT.tienGiuLai && {
                        phanTram: data.dieuKienTheoHSMT.tienGiuLai.phanTram,
                        gioiHanTienGiuLai: data.dieuKienTheoHSMT.tienGiuLai.gioiHanTienGiuLai,
                        thanhToanTienGui: data.dieuKienTheoHSMT.tienGiuLai.thanhToanTienGui
                    },
                    phatTreTienDo: data.dieuKienTheoHSMT.phatTreTienDo && {
                        phanTram: data.dieuKienTheoHSMT.phatTreTienDo.phanTram,
                        gioiHanPhatTienDo: data.dieuKienTheoHSMT.phatTreTienDo.gioiHanPhatTienDo
                    },
                    thoiGianBaoHanh: data.dieuKienTheoHSMT.thoiGianBaoHanh,
                    baoHiem: data.dieuKienTheoHSMT.baoHiem && {
                        baoHiemMayMoc: (data.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc || []).map(x => x.baoHiemItem),
                        baoHiemConNguoi: data.dieuKienTheoHSMT.baoHiem.baoHiemConNguoi,
                        baoHiemCongTrinh: data.dieuKienTheoHSMT.baoHiem.baoHiemCongTrinh
                    }
                },
                dieuKienTheoHBC: data.dieuKienTheoHBC && {
                    baoLanhThucHien: data.dieuKienTheoHBC.baoLanhThucHien && {
                        phanTram: data.dieuKienTheoHBC.baoLanhThucHien.phanTram,
                        hieuLuc: data.dieuKienTheoHBC.baoLanhThucHien.hieuLuc
                    },
                    baoLanhTamUng: data.dieuKienTheoHBC.baoLanhTamUng && {
                        phanTram: data.dieuKienTheoHBC.baoLanhTamUng.phanTram,
                        hieuLuc: data.dieuKienTheoHBC.baoLanhTamUng.hieuLuc
                    },
                    thanhToan: data.dieuKienTheoHBC.thanhToan && {
                        loaiThanhToan: data.dieuKienTheoHBC.thanhToan.loaiThanhToan,
                        thoiGianThanhToan: data.dieuKienTheoHBC.thanhToan.thoiGianThanhToan,
                        thanhToanKhiTapKet: data.dieuKienTheoHBC.thanhToan.thanhToanKhiTapKet
                    },
                    tienGiuLai: data.dieuKienTheoHBC.tienGiuLai && {
                        phanTram: data.dieuKienTheoHBC.tienGiuLai.phanTram,
                        gioiHanTienGiuLai: data.dieuKienTheoHBC.tienGiuLai.gioiHanTienGiuLai,
                        thanhToanTienGui: data.dieuKienTheoHBC.tienGiuLai.thanhToanTienGui
                    },
                    phatTreTienDo: data.dieuKienTheoHBC.phatTreTienDo && {
                        phanTram: data.dieuKienTheoHBC.phatTreTienDo.phanTram,
                        gioiHanPhatTienDo: data.dieuKienTheoHBC.phatTreTienDo.gioiHanPhatTienDo
                    },
                    thoiGianBaoHanh: data.dieuKienTheoHBC.thoiGianBaoHanh,
                    baoHiem: data.dieuKienTheoHBC.baoHiem && {
                        baoHiemMayMoc: (data.dieuKienTheoHBC.baoHiem.baoHiemMayMoc || []).map(x => x.baoHiemItem),
                        baoHiemConNguoi: data.dieuKienTheoHBC.baoHiem.baoHiemConNguoi,
                        baoHiemCongTrinh: data.dieuKienTheoHBC.baoHiem.baoHiemCongTrinh
                    }
                }
            };
            this.hoSoDuThauService.emitDataStepConditionContract(objData);
        });
        this.hoSoDuThauService.scrollToView(true);
    }

    addFormArrayControl() {
        this.conditionContractForm.updateValueAndValidity();
        const formGroupHSMT = (this.conditionContractForm.get(
            'dieuKienTheoHSMT'
        ) as FormGroup).controls.baoHiem as FormGroup;
        const formArrayHSMT = formGroupHSMT.get('baoHiemMayMoc') as FormArray;
        const formItemHSMT = this.fb.group({
            baoHiemItem: {
                value: '',
                disabled: this.isModeView
            }
        });
        formArrayHSMT.updateValueAndValidity();
        formArrayHSMT.push(formItemHSMT);

        const formGroupHBC = (this.conditionContractForm.get(
            'dieuKienTheoHBC'
        ) as FormGroup).controls.baoHiem as FormGroup;
        const formArrayHBC = formGroupHBC.get('baoHiemMayMoc') as FormArray;
        const formItemHBC = this.fb.group({
            baoHiemItem: {
                value: '',
                disabled: this.isModeView
            }
        });
        formArrayHBC.updateValueAndValidity();
        formArrayHBC.push(formItemHBC);

    }

    removeFormArrayControl(name: string, idx: number) {
        const formGroupHSMT = (this.conditionContractForm.get(
            'dieuKienTheoHSMT'
        ) as FormGroup).controls.baoHiem as FormGroup;
        const formArrayHSMT = formGroupHSMT.get('baoHiemMayMoc') as FormArray;
        formArrayHSMT.removeAt(idx);


        const formGroupHBC = (this.conditionContractForm.get(
            'dieuKienTheoHBC'
        ) as FormGroup).controls.baoHiem as FormGroup;
        const formArrayHBC = formGroupHBC.get('baoHiemMayMoc') as FormArray;
        formArrayHBC.removeAt(idx);
    }

    routerLink(e, link) {
        if (e.code === 'Enter') {
            this.router.navigate([`/package/detail/${this.packageId}/attend/build/summary/form/create/${link}`]);
        }
    }

    saveData() {
        this.parent.onSubmit(false, false);
    }
}
