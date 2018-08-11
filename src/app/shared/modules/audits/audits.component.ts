import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuditItem, PagedResult } from '../../models/index';
import { AuditService } from '../../services/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})
export class AuditsComponent implements OnInit {
  @Input() moduleName: string;
  @Input() moduleItemId: number;
  audits$: Observable<PagedResult<AuditItem[]>>;
  audits: AuditItem[];
  pagedResult: PagedResult<AuditItem>;
  constructor(
    private router: Router,
    private auditService: AuditService,
  ) { }

  ngOnInit() {
    this.auditService.getAuditsByModuleItemId(this.moduleName, this.moduleItemId, 0, 3)
      .subscribe(pagedResult => {
        this.pagedResult = pagedResult;
        this.audits = pagedResult.items;
      });
  }

  // onLoadMore() {
  //   this.auditService.getAuditsByModuleItemId(this.moduleName, this.moduleItemId,
  //      +this.pagedResult.currentPage + 1 , +this.pagedResult.pageSize)
  //     .subscribe(pagedResult => {
  //       this.pagedResult = pagedResult;
  //       this.audits = this.audits.concat(pagedResult.items);
  //     });
  // }

  // onViewModeClick() {
  //   switch (this.viewMode) {
  //     case 'partial':
  //       this.router.navigate([`/${this.moduleName}/detail/${this.moduleItemId}/audit`]);
  //       break;
  //     case 'partialEvent':
  //       this.router.navigate([`/${this.moduleName}/event/detail/${this.moduleItemId}/audit`]);
  //       break;
  //     case 'partialTask':
  //       this.router.navigate([`/${this.moduleName}/task/detail/${this.moduleItemId}/audit`]);
  //       break;
  //     case 'all':
  //   }
  // }
}
