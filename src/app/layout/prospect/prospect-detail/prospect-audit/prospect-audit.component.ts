import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prospect-audit',
  templateUrl: './prospect-audit.component.html',
  styleUrls: ['./prospect-audit.component.scss']
})
export class ProspectAuditComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);
  }

}
