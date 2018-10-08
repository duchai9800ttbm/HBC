import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { DienGiaiDieuKienHopDong } from '../../../../../../../../shared/models/ho-so-du-thau/dien-giai-yeu-cau';
import DateTimeConvertHelper from '../../../../../../../../shared/helpers/datetime-convert-helper';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';

@Component({
    selector: 'app-summary-condition-form-condition-contract',
    templateUrl: './summary-condition-form-condition-contract.component.html',
    styleUrls: ['./summary-condition-form-condition-contract.component.scss']
})
export class SummaryConditionFormConditionContractComponent implements OnInit {
    conditionContractForm: FormGroup;
    dataStepConditionContract = new DienGiaiDieuKienHopDong();
    isModelView = false;

    get baoHiemMayMocHSMTFA(): FormArray {
        const dieuKienHSMT = this.conditionContractForm.get('dieuKienTheoHSMT') as FormGroup;
        const baoHiem = dieuKienHSMT.get('baoHiem') as FormGroup;
        return baoHiem.get('baoHiemMayMoc') as FormArray;
    }

    get baoHiemMayMocHBCFA(): FormArray {
        const dieuKienHSMT = this.conditionContractForm.get('dieuKienTheoHBC') as FormGroup;
        const baoHiem = dieuKienHSMT.get('baoHiem') as FormGroup;
        return baoHiem.get('baoHiemMayMoc') as FormArray;
    }

    constructor(
        private fb: FormBuilder,
        private hoSoDuThauService: HoSoDuThauService,
        private summaryConditionFormComponent: SummaryConditionFormComponent
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
        });
    }

    createForm() {
        this.conditionContractForm = this.fb.group({

            loaiHopDong: this.fb.group({
                name: {
                    value: this.dataStepConditionContract && this.dataStepConditionContract.loaiHopDong
                        && this.dataStepConditionContract.loaiHopDong.name,
                    disabled: this.isModelView
                },
                desc: {
                    value: this.dataStepConditionContract.loaiHopDong.desc,
                    disabled: this.isModelView
                }
            }),
            dieuKienTheoHSMT: this.fb.group({
                baoLanhThucHien: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien.phanTram,
                        disabled: this.isModelView
                    },
                    hieuLuc: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhThucHien.hieuLuc,
                        disabled: this.isModelView
                    }
                }),

                baoLanhTamUng: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng.phanTram,
                        disabled: this.isModelView
                    },
                    hieuLuc: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoLanhTamUng.hieuLuc,
                        disabled: this.isModelView
                    }
                }),

                thanhToan: this.fb.group({
                    loaiThanhToan: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan.loaiThanhToan,
                        disabled: this.isModelView
                    },
                    thoiGianThanhToan: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan.thoiGianThanhToan,
                        disabled: this.isModelView
                    },
                    thanhToanKhiTapKet: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHSMT.thanhToan.thanhToanKhiTapKet,
                        disabled: this.isModelView
                    }
                }),

                tienGiuLai: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.phanTram,
                        disabled: this.isModelView
                    },
                    gioiHanTienGiuLai: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.gioiHanTienGiuLai,
                        disabled: this.isModelView
                    },
                    thanhToanTienGui: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHSMT.tienGiuLai.thanhToanTienGui,
                        disabled: this.isModelView
                    }
                }),

                phatTreTienDo: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo
                            && this.dataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo.phanTram,
                        disabled: this.isModelView
                    },
                    gioiHanPhatTienDo: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo
                            && this.dataStepConditionContract.dieuKienTheoHSMT.phatTreTienDo.gioiHanPhatTienDo,
                        disabled: this.isModelView
                    }
                }),

                thoiGianBaoHanh: {
                    value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                        && this.dataStepConditionContract.dieuKienTheoHSMT.thoiGianBaoHanh,
                    disabled: this.isModelView
                },

                baoHiem: this.fb.group({
                    baoHiemMayMoc: this.fb.array([]),
                    baoHiemConNguoi: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemConNguoi,
                        disabled: this.isModelView
                    },
                    baoHiemCongTrinh: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHSMT
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem
                            && this.dataStepConditionContract.dieuKienTheoHSMT.baoHiem.baoHiemCongTrinh,
                        disabled: this.isModelView
                    }
                })
            }),
            dieuKienTheoHBC: this.fb.group({
                baoLanhThucHien: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien.phanTram,
                        disabled: this.isModelView
                    },
                    hieuLuc: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhThucHien.hieuLuc,
                        disabled: this.isModelView
                    }
                }),

                baoLanhTamUng: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng.phanTram,
                        disabled: this.isModelView
                    },
                    hieuLuc: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoLanhTamUng.hieuLuc,
                        disabled: this.isModelView
                    }
                }),

                thanhToan: this.fb.group({
                    loaiThanhToan: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan.loaiThanhToan,
                        disabled: this.isModelView
                    },
                    thoiGianThanhToan: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan.thoiGianThanhToan,
                        disabled: this.isModelView
                    },
                    thanhToanKhiTapKet: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan
                            && this.dataStepConditionContract.dieuKienTheoHBC.thanhToan.thanhToanKhiTapKet,
                        disabled: this.isModelView
                    }
                }),

                tienGiuLai: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai.phanTram,
                        disabled: this.isModelView
                    },
                    gioiHanTienGiuLai: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai.gioiHanTienGiuLai,
                        disabled: this.isModelView
                    },
                    thanhToanTienGui: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai
                            && this.dataStepConditionContract.dieuKienTheoHBC.tienGiuLai.thanhToanTienGui,
                        disabled: this.isModelView
                    }
                }),

                phatTreTienDo: this.fb.group({
                    phanTram: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.phatTreTienDo
                            && this.dataStepConditionContract.dieuKienTheoHBC.phatTreTienDo.phanTram,
                        disabled: this.isModelView
                    },
                    gioiHanPhatTienDo: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.phatTreTienDo
                            && this.dataStepConditionContract.dieuKienTheoHBC.phatTreTienDo.gioiHanPhatTienDo,
                        disabled: this.isModelView
                    }
                }),

                thoiGianBaoHanh: {
                    value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                        && this.dataStepConditionContract.dieuKienTheoHBC.thoiGianBaoHanh,
                    disabled: this.isModelView
                },

                baoHiem: this.fb.group({
                    baoHiemMayMoc: this.fb.array([]),
                    baoHiemConNguoi: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoHiem
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemConNguoi,
                        disabled: this.isModelView
                    },
                    baoHiemCongTrinh: {
                        value: this.dataStepConditionContract && this.dataStepConditionContract.dieuKienTheoHBC
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoHiem
                            && this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemCongTrinh,
                        disabled: this.isModelView
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
                    disabled: this.isModelView
                }
            }));
        });

        this.dataStepConditionContract.dieuKienTheoHBC.baoHiem.baoHiemMayMoc.forEach(x => {
            const controls = <FormArray>((this.conditionContractForm.controls.dieuKienTheoHBC as FormGroup)
                .controls.baoHiem as FormGroup).controls.baoHiemMayMoc as FormArray;
            controls.push(this.fb.group({
                baoHiemItem: {
                    value: x,
                    disabled: this.isModelView
                }
            }));
        });


        this.conditionContractForm.valueChanges.subscribe(data => {
            console.log(data);
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
