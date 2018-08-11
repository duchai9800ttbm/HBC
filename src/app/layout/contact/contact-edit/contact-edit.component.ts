import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Observable } from "rxjs/Observable";
import { ContactModel } from '../../../shared/models/index';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContactService } from '../../../shared/services/index';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss'],
  animations: [routerTransition()]
})
export class ContactEditComponent implements OnInit {

  contact$: Observable<ContactModel>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.contact$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.contactService.view(params.get('id')));
  }

}
