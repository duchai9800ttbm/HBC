import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from '../../../../../shared/services';
import { Subscriber } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.scss']
})
export class ListContactComponent implements OnInit {
  @Input() customerId: number;
  @Input() customerName: string;
  constructor(
    private customerService: CustomerService,
    private router: Router,

  ) { }
  public contacts: any[];
  ngOnInit() {
    this.customerService.getContactList(this.customerId)
    .subscribe(result => {
      this.contacts = result;
    });
  }

  addContact() {
    this.router.navigate(['/contact/create']);
  }
}
