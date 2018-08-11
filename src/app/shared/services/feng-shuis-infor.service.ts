import { Injectable } from '@angular/core';
import { ApiService, SessionService } from '.';
import { Observable } from '../../../../node_modules/rxjs/Observable';

@Injectable()
export class FengShuisInforService {

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
  ) { }
  get employeeId() {
    return this.sessionService.currentUser.employeeId;
  }
  getFengShuisInfo(
    lunarBirthDay: number | string,
    gender:  string
  ): Observable<any> {
    const that = this;
    return that.apiService
      .get(`employee/${this.employeeId}/feng-shuis-infor/?lunarBirthday=${lunarBirthDay}&gender=${gender}`)
      .map(response => response.result)
      .share();
  }

}
