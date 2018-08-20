import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { CallCenterService } from '../../shared/services/call-center.service';
import { OpportunityService } from '../../shared/services';
import { Subscription } from 'rxjs';
import { CallCenterHistoryService, CallModel } from '../../shared/services/call-center-history.service';

@Component({
  selector: 'app-call-center',
  templateUrl: './call-center.component.html',
  styleUrls: ['./call-center.component.scss']
})
export class CallCenterComponent implements OnInit, OnChanges {
  sefl = this;
  listContacts = new Array();
  title;
  currentPhone;
  public contacts = [];
  public customers = [];
  public prospects = [];
  public phoneNumber;
  public totalItemCalling = 0;
  public heigth: number;
  private currentPhoneFirst = 'first';
  private currentPhoneTwo = 'two';
  private sub: Subscription;
  private callModel = new CallModel();
  public opened = false;
  constructor(
    private callCenterService: CallCenterService,
    private opportunityService: OpportunityService,
    private callCenterHistoryService: CallCenterHistoryService
  ) { }
  @Input() phoneNumberCall = '';
  @Input() listPhoneNumberCall = [];
  @Input() statusCall = '';
  ngOnInit() {
    //
    // this.phoneNumberCall = '0935439807';
    // this.showInfo();
    //
    this.sub = IntervalObservable.create(3000).subscribe(_ => {
      if (!this.phoneNumberCall) {
        this.showInfo();
      }
    });
    this.callCenterHistoryService.currentCall.subscribe(result => {
      this.callModel = result;
      if (this.callModel.phoneStatus === 'Start' || this.callModel.phoneStatus === 'DialAnswer') {
        this.contacts = [];
        this.prospects = [];
        this.customers = [];
        this.phoneNumber = this.callModel.phoneNumber;
        this.showInfo2(this.callModel);
      }
    });
  }

  ngOnChanges(): void {
    if (!(this.listPhoneNumberCall && this.listPhoneNumberCall.length)) {
      this.phoneNumberCall = null;
      this.close();
    }
    if (this.phoneNumberCall && this.phoneNumberCall !== this.currentPhone &&
      (this.statusCall == 'Start' || this.statusCall == 'DialAnswer')) {
      this.totalItemCalling = 0;
      //  this.title = this.statusCall === '' ? 'Đã gọi' : this.title;
      this.currentPhone = this.phoneNumberCall;
      this.contacts = [];
      this.prospects = [];
      this.customers = [];
      this.phoneNumber = this.phoneNumberCall;
      this.callCenterService.getObjectInfoByCallNumber(`0${this.phoneNumberCall}`).subscribe(res => {
        if (res && res.length) {
          this.totalItemCalling++;
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
      });
      this.open();
    }
  }

  showInfo2(callModel: CallModel) {
    this.totalItemCalling = 0;
    this.title = this.callModel.phoneStatus === 'DialAnswer' ? 'Đang trả lời' : this.title;
    this.currentPhone = this.callModel.phoneNumber;
    this.contacts = [];
    this.prospects = [];
    this.customers = [];
    this.phoneNumber = this.callModel.phoneNumber;
    this.callCenterService.getObjectInfoByCallNumber(`0${callModel.phoneNumber}`).subscribe(res => {
      if (res && res.length) {
        this.totalItemCalling++;
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
    });
    this.open();
  }

  public close() {
    this.opened = false;
    this.totalItemCalling = 0;
    this.phoneNumberCall = null;
  }

  public close2() {
    this.opened = false;
  }

  public open() {
    this.opened = true;
  }

  showInfo() {
    const that = this;
    this.callCenterService.getCallNumbers().subscribe(result => {
      const listCallNumber = result;
      if (listCallNumber.length === 0) {
        this.opened = false;
        this.totalItemCalling = 0;
        this.contacts = [];
        this.prospects = [];
        this.customers = [];
      }
      //
      // listCallNumber.push({'callernumber': 1649697075});
      //
      // loc ra nhung item dang goi dien
      listCallNumber.forEach(e => {
        if (e.callStatus === 'DialAnswer' || 'Start' && this.totalItemCalling < 1) {
          this.totalItemCalling++;
          this.title = (e.callStatus === 'DialAnswer') ? 'Đang trả lời' : 'Đang gọi';
          this.currentPhoneTwo = e.callernumber.toString();
          this.phoneNumber = e.callernumber;
          this.callCenterService.getObjectInfoByCallNumber(`0${e.callernumber}`).subscribe(res => {
            if (res && res.length) {
              res.forEach(element => {
                switch (element.objectType) {
                  case 'Contact': {
                    if (!this.contacts.length || this.contacts.every(x => x.objectId != element.objectId)) {
                      this.contacts.push(element);
                    }
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
          });
        }
      });

      // check dieu kien de dong mo popup
      if (this.totalItemCalling === 0) {
        this.close();
        this.currentPhoneFirst = 'first';
        this.currentPhoneTwo = 'two';
      }

      if (this.totalItemCalling > 0 && !(this.currentPhoneFirst === this.currentPhoneTwo)) {
        this.currentPhoneFirst = this.currentPhoneTwo;
        this.open();
      }
    });
  }
}
