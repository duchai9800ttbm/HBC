import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../../../../shared/services/index';

@Component({
  selector: 'app-contact-activity',
  templateUrl: './contact-activity.component.html',
  styleUrls: ['./contact-activity.component.scss']
})
export class ContactActivityComponent implements OnInit {

  id: string;
  name: string;
  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => {
      this.id = value.id;
      this.contactService.view(this.id)
      .subscribe(result => this.name = `${result.lastName} ${result.firstName}`);
    });

  }

}
