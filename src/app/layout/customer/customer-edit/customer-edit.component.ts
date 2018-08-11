import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../shared/services/index';
import { CustomerModel } from '../../../shared/models/index';
import { Observable } from 'rxjs/Observable';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  animations: [routerTransition()]
})
export class CustomerEditComponent implements OnInit {

  customer$: Observable<CustomerModel>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.customer$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.customerService.view(params.get('id')));
  }

}
