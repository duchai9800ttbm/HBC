import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ContactModel } from '../../../shared/models/index';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.scss'],
  animations: [routerTransition()]
})
export class ContactCreateComponent implements OnInit {


  contactModel: ContactModel = new ContactModel();
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contactModel.mobilePhone = params.sdt;
    });
  }

}
