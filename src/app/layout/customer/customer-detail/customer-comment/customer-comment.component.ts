import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-comment',
  templateUrl: './customer-comment.component.html',
  styleUrls: ['./customer-comment.component.scss']
})
export class CustomerCommentComponent implements OnInit {

  id: string;
  constructor(private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
