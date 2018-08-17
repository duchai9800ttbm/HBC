import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    FormArray
} from '../../../../../../node_modules/@angular/forms';

@Component({
    selector: 'app-package-permission-user',
    templateUrl: './package-permission-user.component.html',
    styleUrls: ['./package-permission-user.component.scss']
})
export class PackagePermissionUserComponent implements OnInit {
    packagePermissionUserForm: FormGroup;
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.packagePermissionUserForm = this.fb.group({
            chuTri: this.fb.array([]),
            phanPhoiHoSo: this.fb.array([]),
            chuTriKhoiLuong: this.fb.array([]),
            chuyenVienGoiGia: this.fb.array([]),
            chuTriMEP: this.fb.array([]),
            chuNhiemGoiPrelims: this.fb.array([]),
            chuNhiemKyThuat: this.fb.array([]),
            chuNhiemHoSo: this.fb.array([]),
            chuNhiemPhapLy: this.fb.array([]),
            // ----------
            chuDauTu: this.fb.array([]),
            quanLyDuAn: this.fb.array([]),
            quanLyChiPhi: this.fb.array([]),
            thietKeKienTruc: this.fb.array([]),
            thietKeKetCau: this.fb.array([]),
            thietKeCoDien: this.fb.array([]),
            khac: this.fb.array([])
        });
        // tslint:disable-next-line:forin
        for (const control in this.packagePermissionUserForm.value) {
            this.addFormItem(control);
        }
    }

    addFormItem(name: string): void {
        const itemArr = this.packagePermissionUserForm.get(name) as FormArray;
        const item = this.fb.group({
            name: '',
            department: ''
        });
        itemArr.push(item);
    }

    removeFormItem(name: string, idx: number) {
        const attachedArray = <FormArray>(
            this.packagePermissionUserForm.controls[name]
        );
        attachedArray.removeAt(idx);
    }
}
