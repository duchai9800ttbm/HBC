import { routerTransition } from '../../../router.animations';
import { Component, OnInit } from '@angular/core';
import { CustomerModel } from '../../../shared/models/customer/customer.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss'],
  animations: [routerTransition()]
})
export class CustomerCreateComponent implements OnInit {
  customerModel: CustomerModel = new CustomerModel();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.customerModel.phoneNumberOfficial = params.sdt;
    });
  }

}
