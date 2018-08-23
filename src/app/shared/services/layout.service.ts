import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LayoutService {
  static layoutSubject = new BehaviorSubject<boolean>(false);

  constructor() { }
  watchLayoutSubject(): Observable<boolean> {
    return LayoutService.layoutSubject;
  }
  emitEvent(value: boolean) {
    LayoutService.layoutSubject.next(value);
  }
}
