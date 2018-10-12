import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { ChangeDactivitites } from '../models/side-bar/change-dactivitites.model';
import { PagedResult } from '../models';

@Injectable()
export class LayoutService {
  static layoutSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService
  ) { }
  watchLayoutSubject(): Observable<boolean> {
    return LayoutService.layoutSubject;
  }
  emitEvent(value: boolean) {
    LayoutService.layoutSubject.next(value);
  }
  getDataChangeRecently(page: number, pageSize: number): Observable<PagedResult<ChangeDactivitites>> {
    const url = `changedactivitites/${page}/${pageSize}`;
    return this.apiService.get(url).map(response => {
      const res = response.result;
      return {
        currentPage: res.pageIndex,
        pageSize: res.pageSize,
        pageCount: res.totalPages,
        total: res.totalCount,
        items: (res.items || [])
      };
    });
  }
}
