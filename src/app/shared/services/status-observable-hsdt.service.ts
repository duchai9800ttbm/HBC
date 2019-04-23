import { Injectable } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';

@Injectable()
export class StatusObservableHsdtService {
  statusPackageService: Subject<string> = new Subject<string>();
  constructor() { }
  change() {
    this.statusPackageService.next();
  }
}
