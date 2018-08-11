import { Component, OnInit, Input } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AuditItem, PagedResult } from '../../models/index';
import { AuditService } from '../../services/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audits-list',
  templateUrl: './audits-list.component.html',
  styleUrls: ['./audits-list.component.scss']
})
export class AuditsListComponent implements OnInit {

  @Input() moduleName: string;
  @Input() moduleItemId: number;
  audits$: Observable<PagedResult<AuditItem[]>>;
  audits: AuditItem[];
  pagedResult: PagedResult<AuditItem>;
  showButton = true;
  constructor(
    private auditService: AuditService,
  ) { }

  ngOnInit() {
    this.auditService.getAuditsByModuleItemId(this.moduleName, this.moduleItemId, 0, 3)
      .subscribe(pagedResult => {
        this.pagedResult = pagedResult;
        this.audits = pagedResult.items;
        this.showButton = pagedResult.pageCount !== 1;
      });
  }

  onLoadMore() {
    this.auditService.getAuditsByModuleItemId(this.moduleName, this.moduleItemId,
      +this.pagedResult.currentPage + 1, +this.pagedResult.pageSize)
      .subscribe(pagedResult => {
        this.pagedResult = pagedResult;
        this.audits = this.audits.concat(pagedResult.items);
        this.showButton = (pagedResult.items.length > 0) && (+pagedResult.currentPage + 1 < pagedResult.pageCount);
      });
  }


}
