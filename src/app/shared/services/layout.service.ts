import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

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
  getDataChangeRecently(page: number, pageSize: number): Observable<any> {
    const url = `changedactivitites/${page}/${pageSize}`;
    return this.apiService.get(url).map(res => res.result);
  }
}
