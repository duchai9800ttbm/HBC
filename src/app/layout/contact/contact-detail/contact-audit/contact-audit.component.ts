import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-audit',
  templateUrl: './contact-audit.component.html',
  styleUrls: ['./contact-audit.component.scss']
})
export class ContactAuditComponent implements OnInit {

  id: string;
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
