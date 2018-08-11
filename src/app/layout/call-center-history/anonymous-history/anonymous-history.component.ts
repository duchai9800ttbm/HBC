import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anonymous-history',
  templateUrl: './anonymous-history.component.html',
  styleUrls: ['./anonymous-history.component.scss']
})
export class AnonymousHistoryComponent implements OnInit {
  @Input() phoneNumber: string;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  createProspect() {
    this.router.navigate([`/prospect/create`, {
      sdt: `0${this.phoneNumber}`
    }]);
  }
  createContact() {
    this.router.navigate([`/contact/create`, {
      sdt: `0${this.phoneNumber}`
    }]);
  }
  createCustomer() {
    this.router.navigate([`/customer/create`, {
      sdt: `0${this.phoneNumber}`
    }]);
  }
}
