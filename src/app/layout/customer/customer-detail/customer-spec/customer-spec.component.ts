import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CustomerService } from '../../../../shared/services/index';
import { CustomerModel } from '../../../../shared/models/index';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FengShuisInforComponent } from '../../../../shared/components/feng-shuis-infor/feng-shuis-infor.component';
import { FengShuisInforService } from '../../../../shared/services/feng-shuis-infor.service';

@Component({
  selector: 'app-customer-spec',
  templateUrl: './customer-spec.component.html',
  styleUrls: ['./customer-spec.component.scss'],
  animations: [routerTransition()]
})
export class CustomerSpecComponent implements OnInit {
  customer$: Observable<CustomerModel>;
  public isCollapsedMain = false;
  public isCollapsedAddress = false;
  public isCollapsedDesc = false;

  public dialog;
  gender;
  lunarBirthday;
  fengShuisInforModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private dialogService: DialogService,
    private fengShuisInforService: FengShuisInforService
  ) { }

  ngOnInit(): void {
    this.customer$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
      this.customerService.view(params.get('id')));
    this.customer$.subscribe(result => {
      this.gender = result.gender;
      this.lunarBirthday = result.lunarBirthday;
      if (result.lunarBirthday && result.gender) {
        this.fengShuisInforService.getFengShuisInfo(result.lunarBirthday, result.gender).subscribe(res => {
          this.fengShuisInforModel = res;
        });
      }
    });
  }
  goToHistotyProspectDetail(prospectId, customerId) {
    this.router.navigate([`/prospect/detail-history/${prospectId}`], { queryParams: { customerId: customerId } });
  }
  goToDeitalContact(contactId) {
    this.router.navigate([`/contact/detail/${contactId}`]);
  }

  public showDialog() {
    this.dialog = this.dialogService.open({
      title: 'PHONG THỦY',
      content: FengShuisInforComponent,
      width: 750,
      height: 540,
      minWidth: 250,
    });
    const model = this.dialog.content.instance;
    model.gender = this.gender;
    model.lunarBirthday = this.lunarBirthday;
  }

}
