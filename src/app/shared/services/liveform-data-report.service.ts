import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject, Observable } from 'rxjs';
import { ScaleOverall } from '../models/site-survey-report/scale-overall.model';
import { DescribeOverall } from '../models/site-survey-report/describe-overall.model';
import { Traffic } from '../models/site-survey-report/traffic.model';
import { DemoConso } from '../models/site-survey-report/demo-conso.model';
import { SiteTempService } from '../models/site-survey-report/site-temp-service.model';
import { SoilCondition } from '../models/site-survey-report/soil-condition.model';

@Injectable()
export class LiveformDataReportService {
  scaleOverallModel: ScaleOverall;
  describeOverallModel: DescribeOverall;
  trafficModel: Traffic;
  demoConsoModel: DemoConso;
  siteTempServiceModel: SiteTempService;
  soilConditionModel: SoilCondition;

  private storeData = [];
  // private dataStringSource = new BehaviorSubject<ScaleOverall>(null);
  // public dataString$ = this.dataStringSource.asObservable();

  private dataStringSource = new BehaviorSubject<ScaleOverall>(null);
  public dataString$ = this.dataStringSource.asObservable();

  constructor() { }
  // public saveData(obj: any) {
  //   this.storeData.scaleOverallModel = obj;
  //   this.dataStringSource.next(this.scaleOverallModel);
  //   console.log(obj);
  // }

  public saveData(obj: ScaleOverall) {
    this.scaleOverallModel = obj;
    this.dataStringSource.next(this.scaleOverallModel);
    this.storeData.push(this.scaleOverallModel);
  }
}
