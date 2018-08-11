import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../../shared/services/index';

@Component({
  selector: 'app-customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss']
})
export class CustomerActivityComponent implements OnInit {

  id: string;
  name: string;
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => {
      this.id = value.id;
      this.customerService.view(this.id).subscribe(result => this.name = result.name);
    });

  }

}
