import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anonymous',
  templateUrl: './anonymous.component.html',
  styleUrls: ['./anonymous.component.scss']
})
export class AnonymousComponent implements OnInit {
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
