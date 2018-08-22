import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
    selector: 'app-package-permission-bid',
    templateUrl: './package-permission-bid.component.html',
    styleUrls: ['./package-permission-bid.component.scss']
})
export class PackagePermissionBidComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = DATATABLE_CONFIG;
    packagePermissionReviewForm: FormGroup;

    arr1 = [1, 2, 3];
    arr2 = [4, 5, 6];

    constructor(private fb: FormBuilder,
        private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        setTimeout(() => {
            this.dtTrigger.next();
        });
        this.createForm();
    }

    createForm() {
        this.packagePermissionReviewForm = this.fb.group({
            trienKhai: this.fb.array([]),
            createBid: this.fb.array([]),
            trinhDuyetGia: this.fb.array([]),
            donBaoGia: this.fb.array([]),
            hsdtDaKy: this.fb.array([]),
            phongVan: this.fb.array([]),
        });
        // tslint:disable-next-line:forin
        for (const control in this.packagePermissionReviewForm.value) {
            if (control != 'createBid') {
                this.addFormItem(control);
            }
        }
        this.addGroupCreateBidFormItem(0);
    }

    addGroupCreateBidFormItem(index: number) {
        this.addCreateBidFormItem();
        this.addCreateBidItemFormItem(index);
    }

    addCreateBidFormItem() {
        const itemArr = this.packagePermissionReviewForm.get('createBid') as FormArray;
        const item = this.fb.group({
            types: this.fb.array([])
        });
        itemArr.push(item);
        this.packagePermissionReviewForm.reset();
    }

    addCreateBidItemFormItem(i: number) {
        const itemArr = this.packagePermissionReviewForm.get('createBid') as FormArray;
        // tslint:disable-next-line:no-unused-expression
        const bidArr = itemArr.controls[i].get('types') as FormArray;
        const item = this.fb.group({
            item: ''
        });
        bidArr.push(item);
    }

    removeCreateBidItemFormItem(i: number, j: number) {
        const itemArr = this.packagePermissionReviewForm.get('createBid') as FormArray;
        const bidArr = itemArr.controls[i].get('types') as FormArray;
        bidArr.removeAt(j);
    }

    addFormItem(name: string): void {
        const itemArr = this.packagePermissionReviewForm.get(name) as FormArray;
        const item = this.fb.group({
            name: '',
            department: ''
        });
        itemArr.push(item);
        setTimeout(() => {
            this.dtTrigger.next();
        });
    }

    removeFormItem(name: string, idx: number) {
        const attachedArray = <FormArray>(
            this.packagePermissionReviewForm.controls[name]
        );
        attachedArray.removeAt(idx);
        setTimeout(() => {
            this.dtTrigger.next();
        });
    }

    testSubmit() {
        console.log(this.packagePermissionReviewForm.value);
    }
}
