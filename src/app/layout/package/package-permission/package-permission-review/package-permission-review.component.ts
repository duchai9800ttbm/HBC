import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import { Subject } from '../../../../../../node_modules/rxjs';
import {
    FormGroup,
    FormBuilder,
    FormArray
} from '../../../../../../node_modules/@angular/forms';
import { PackageService } from '../../../../shared/services/package.service';
import { PackagePermissionComponent } from '../package-permission.component';
import { SETTING_BID_STAGE } from '../../../../shared/configs/common.config';

@Component({
    selector: 'app-package-permission-review',
    templateUrl: './package-permission-review.component.html',
    styleUrls: ['./package-permission-review.component.scss']
})
export class PackagePermissionReviewComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = DATATABLE_CONFIG;
    packagePermissionReviewForm: FormGroup;
    packageId: number;

    constructor(
        private fb: FormBuilder,
        private packageService: PackageService
    ) {}

    ngOnInit() {
        this.packageId = PackagePermissionComponent.packageId;
        setTimeout(() => {
            this.dtTrigger.next();
        });
        this.createForm();
        this.packageService.getBidPermissionGroupByStage(this.packageId, SETTING_BID_STAGE.Hsmt).subscribe(data => {
            console.log(data);
        });
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
