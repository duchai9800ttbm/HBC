import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CallCenterService } from '../../shared/services/call-center.service';
import { OpportunityService } from '../../shared/services/opportunity.service';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { CallCenterHistoryService, CallModel } from '../../shared/services/call-center-history.service';

@Component({
  selector: 'app-call-center-history',
  templateUrl: './call-center-history.component.html',
  styleUrls: ['./call-center-history.component.scss']
})
export class CallCenterHistoryComponent implements OnInit {

  sefl = this;
  public contacts = [];
  public customers = [];
  public prospects = [];
  public phoneNumber;
  public startTime;
  private sub: Subscription;
  public opened = false;
  private callModel = new CallModel();
  constructor(
    private callCenterService: CallCenterService,
    private opportunityService: OpportunityService,
    private callCenterHistoryService: CallCenterHistoryService
  ) { }
  ngOnInit() {
    this.callCenterHistoryService.currentCall.subscribe(result => {
      this.callModel = result;
      if (this.callModel.phoneStatus !== 'Start' && this.callModel.phoneStatus !== 'DialAnswer') {
        this.phoneNumber = this.callModel.phoneNumber;
        this.showInfoCallHistory(this.callModel);
      }
    });

  }
  public close() {
    this.opened = false;
    this.contacts = [];
    this.prospects = [];
    this.customers = [];
  }

  public open() {
    this.opened = true;
  }

  private showInfoCallHistory(callModel: CallModel) {
    this.contacts = [];
    this.prospects = [];
    this.customers = [];
    this.callCenterService.getObjectInfoByCallNumber(`0${callModel.phoneNumber}`)
      .subscribe(res => {
        if (res && res.length) {
          res.forEach(element => {
            switch (element.objectType) {
              case 'Contact': {
                this.contacts.push(element);
                break;
              }
              case 'Customer': {
                this.customers.push(element);
                break;
              }
              case 'Prospect': {
                this.prospects.push(element);
                break;
              }
              default: {

                break;
              }
            }
          });
        }
        this.startTime = callModel.startTime;
        this.open();
      });
  }

}
