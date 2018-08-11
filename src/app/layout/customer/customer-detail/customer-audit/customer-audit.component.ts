import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-audit',
  templateUrl: './customer-audit.component.html',
  styleUrls: ['./customer-audit.component.scss']
})
export class CustomerAuditComponent implements OnInit {

  id: string;
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);
  }

}
