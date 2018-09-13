import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject, Observable } from 'rxjs';
import { ScaleOverall } from '../models/site-survey-report/scale-overall.model';
import { DescribeOverall } from '../models/site-survey-report/describe-overall.model';
import { Traffic } from '../models/site-survey-report/traffic.model';
import { DemoConso } from '../models/site-survey-report/demo-conso.model';
import { SiteTempService } from '../models/site-survey-report/site-temp-service.model';
import { SoilCondition } from '../models/site-survey-report/soil-condition.model';
import { InstantSearchService } from './instant-search.service';
import { FilterPipe } from 'ngx-filter-pipe';
import { ApiService } from './api.service';
import { SessionService } from './session.service';

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

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private filterService: FilterPipe,
    private instantSearchService: InstantSearchService,
  ) { }
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

  tenderSiteSurveying(): Observable<any> {
    const url = `tendersitesurveyingeeport/createorupdate`;
    return this.apiService.post(url).map(res => res);
  }
}
