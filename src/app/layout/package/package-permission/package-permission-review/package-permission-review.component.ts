import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import { Subject } from '../../../../../../node_modules/rxjs';
import {
    FormGroup,
    FormBuilder,
    FormArray
} from '../../../../../../node_modules/@angular/forms';

@Component({
    selector: 'app-package-permission-review',
    templateUrl: './package-permission-review.component.html',
    styleUrls: ['./package-permission-review.component.scss']
})
export class PackagePermissionReviewComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = DATATABLE_CONFIG;
    packagePermissionReviewForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        setTimeout(() => {
            this.dtTrigger.next();
        });
        this.createForm();
    }

    createForm() {
        this.packagePermissionReviewForm = this.fb.group({
            profiles: this.fb.array([]),
            formOfBids: this.fb.array([])
        });
        // tslint:disable-next-line:forin
        for (const control in this.packagePermissionReviewForm.value) {
            this.addFormItem(control);
        }
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
}