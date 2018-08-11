import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../shared/services/index';
import { Observable } from 'rxjs/Observable';
import { AuditItem } from '../../shared/models/index';
import { routerTransition } from '../../router.animations';
import { PagedResult } from '../../shared/models/paging-result.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss'],
  animations: [routerTransition()]
})
export class ChangeListComponent implements OnInit {

  constructor(
    private auditService: AuditService,
    private router: Router,
  ) { }
  audits$: Observable<AuditItem[]>;
  audits: AuditItem[];
  pagedResult: PagedResult<AuditItem>;
  showButton = true;
  ngOnInit() {
    window.scrollTo(0, 0);

    this.auditService.getAudits(0, 5)
      .subscribe(pagedResult => {
        this.pagedResult = pagedResult;
        this.audits = pagedResult.items;
        this.showButton = pagedResult.pageCount !== 1;
      });
  }
  onLoadMore() {
    this.auditService.getAudits(+this.pagedResult.currentPage + 1, +this.pagedResult.pageSize)
      .subscribe(pagedResult => {
        this.showButton = (pagedResult.items.length > 0) && (+pagedResult.currentPage + 1 < pagedResult.pageCount);
        this.pagedResult = pagedResult;
        this.audits = this.audits.concat(pagedResult.items);
      });
  }

  gotoItem(moduleName: string, moduleItemId: string, objectType: string) {
    if (moduleName.toLowerCase() === 'event' || moduleName.toLowerCase() === 'work') {
      const moduleUrl = moduleName === 'event'
        ? 'activity/event'
        : moduleName === 'work'
          ? 'activity/task'
          : moduleName.toLowerCase();

      const detailUrl = `${moduleUrl}/detail`;
      this.router.navigate([detailUrl, moduleItemId]);
    } else {
      this.router.navigate([`/${moduleName}/detail/${moduleItemId}`]);
    }
  }
}
