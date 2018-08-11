import { Component, OnInit, Input } from '@angular/core';
import { DATATABLE_CONFIG } from '../../configs/index';
import { OpportunityService, AlertService, ConfirmationService } from '../../services/index';
import { Subscription, Subject } from 'rxjs';
import { PagedResult } from '../../models/index';
import { OpportunityListItem } from '../../models/opportunity/opportunity-list-item.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-opportunity-table',
  templateUrl: './opportunity-table.component.html',
  styleUrls: ['./opportunity-table.component.scss']
})
export class OpportunityTableComponent implements OnInit {

  @Input() moduleName: string;
  @Input() moduleItemId: string;
  @Input() moduleItemName: string;
  @Input() moduleItemLastName: string;
  @Input() moduleItemFirstName: string;

  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  pagedResult: PagedResult<OpportunityListItem> = new PagedResult<OpportunityListItem>();
  isLeader: boolean;
  constructor(
    private opportunityService: OpportunityService,
    private alertService: AlertService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.dtOptions = DATATABLE_CONFIG;
    this.opportunityService
      .getOpportunitiesByModuleItemId(this.moduleName, this.moduleItemId, 0, 10)
      .subscribe(result => {
        this.rerender(result);
      });
    const session = JSON.parse(window.localStorage.getItem('session'));
    const leaders = session.isLeaders;
    this.isLeader = leaders.some(x => x.isLeader === true);
  }

  pagedResultChange(pagedResult: any) {
    this.refresh();
  }

  refresh(displayAlert: boolean = false): void {
    this.opportunityService
      .getOpportunitiesByModuleItemId(this.moduleName, this.moduleItemId, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        if (displayAlert) {
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất');
        }
      });
  }

  rerender(pagedResult: any) {
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
  }

  gotoCreateOpportunity() {
    this.router.navigate(['/opportunity/create', {
      moduleName: this.moduleName,
      moduleItemId: this.moduleItemId,
      moduleItemName: this.moduleItemName,
      moduleItemLastName: this.moduleItemLastName,
      moduleItemFirstName: this.moduleItemFirstName
    }]);
  }

  delete(id) {
    const that = this;
    that.confirmationService.confirm('Bạn có chắc chắn muốn xóa cơ hội này?',
      () => {
        that.opportunityService.delete([id]).subscribe(_ => {
          // that.router.navigate([`/${this.moduleName}/detail/${this.moduleItemId}/opportunity`]);
          that.alertService.success('Đã xóa cơ hội!', true);
          that.refresh();
        });
      });
  }

}
