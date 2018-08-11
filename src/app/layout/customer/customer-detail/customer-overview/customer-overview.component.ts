import { routerTransition } from '../../../../router.animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CustomerService } from '../../../../shared/services/index';
import { CustomerModel } from '../../../../shared/models/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-customer-overview',
  templateUrl: './customer-overview.component.html',
  styleUrls: ['./customer-overview.component.scss'],
  animations: [routerTransition()]
})
export class CustomerOverviewComponent implements OnInit {
  customer$: Observable<CustomerModel>;
  public isCollapsedMain = false;
  public isCollapsedAddress = false;
  public isCollapsedDesc = false;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.customer$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
      this.customerService.view(params.get('id')));
  }

}
