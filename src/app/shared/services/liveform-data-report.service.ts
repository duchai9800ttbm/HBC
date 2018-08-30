import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject, Observable } from 'rxjs';
import { ScaleOverall } from '../models/site-survey-report/scale-overall.model';

@Injectable()
export class LiveformDataReportService {
  scaleOverallModel: ScaleOverall;
  private dataStringSource = new BehaviorSubject<ScaleOverall>(null);
  public dataString$ = this.dataStringSource.asObservable();

  constructor() { }

  public saveData(obj: ScaleOverall) {
    this.scaleOverallModel = obj;
    this.dataStringSource.next(this.scaleOverallModel);
  }
}
