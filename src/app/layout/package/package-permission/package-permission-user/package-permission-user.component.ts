import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    FormArray
} from '../../../../../../node_modules/@angular/forms';
import { UserService, DataService } from '../../../../shared/services';
import { DictionaryItem } from '../../../../shared/models';
import { DepartmentsFormBranches } from '../../../../shared/models/user/departments-from-branches';
import { Observable } from 'rxjs';
import { BidUserGroupMemberResponsive } from '../../../../shared/models/api-response/setting/bid-user-group-member-responsive';
import { PackageService } from '../../../../shared/services/package.service';
import { PackagePermissionComponent } from '../package-permission.component';
import { UserItemModel } from '../../../../shared/models/user/user-item.model';

@Component({
    selector: 'app-package-permission-user',
    templateUrl: './package-permission-user.component.html',
    styleUrls: ['./package-permission-user.component.scss']
})
export class PackagePermissionUserComponent implements OnInit {
    packagePermissionUserForm: FormGroup;
    listUser: Observable<UserItemModel[]>;
    listBidUserGroupMember: BidUserGroupMemberResponsive[];
    packageId: number;
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private dataService: DataService,
        private packageService: PackageService
    ) {}

    ngOnInit() {
        this.packageId = PackagePermissionComponent.packageId;
        this.listUser = this.userService.getAllUser('');
    }
}
