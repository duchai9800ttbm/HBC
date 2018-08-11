import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Subject, Observable } from 'rxjs/Rx';
import { OpportunityModel } from '../../../shared/models/index';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { OpportunityService } from '../../../shared/services/opportunity.service';
import { AlertService, ConfirmationService } from '../../../shared/services/index';

@Component({
    selector: 'app-opportunity-detail',
    templateUrl: './opportunity-detail.component.html',
    styleUrls: ['./opportunity-detail.component.scss'],
    animations: [routerTransition()]
})
export class OpportunityDetailComponent implements OnInit {
    opportunity$: Observable<OpportunityModel>;
    opportunity: OpportunityModel;
    isNotExist = false;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private confirmationService: ConfirmationService,
        private opportunityService: OpportunityService) { }

    ngOnInit(): void {
        this.opportunity$ = this.route.paramMap.switchMap((params: ParamMap) =>
            this.opportunityService.view(params.get('id')));
        this.opportunity$.subscribe(opportunity => {},
        err => this.isNotExist = true);
    }

    delete(id) {
        const that = this;
        this.confirmationService.confirm('Bạn có chắc chắn muốn xóa cơ hội này?',
            () => {
                that.opportunityService.delete([id]).subscribe(_ => {
                    that.router.navigate(['/opportunity']);
                    that.alertService.success('Đã xóa cơ hội!', true);
                });
            });
    }

    refresh(id) {
        this.opportunity$ = this.opportunityService.view(id);
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
    }
}
