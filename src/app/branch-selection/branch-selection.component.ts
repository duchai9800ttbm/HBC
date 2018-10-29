import { UserModel } from '../shared/models/user/user.model';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { DataService, SessionService } from '../shared/services';
import { DictionaryItem } from '../shared/models';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-branch-selection',
    templateUrl: './branch-selection.component.html',
    styleUrls: ['./branch-selection.component.scss'],
    // animations: [routerTransition()]
})
export class BranchSelectionComponent implements OnInit {
    branches: Observable<DictionaryItem[]>;
    userInfo: UserModel;

    constructor(
        private dataService: DataService,
        private sessionService: SessionService) {
    }

    ngOnInit() {
        this.branches = this.dataService.getBranches();
        this.sessionService.getUserInfo().subscribe(result => this.userInfo = result);
        this.userInfo = this.sessionService.userInfo;

    }

    onClick(item) {
        this.sessionService.branchId = item.id;
    }

    onLoggedout() {
        this.sessionService.destroySession();
    }
}
