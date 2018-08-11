import { ParamMap, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';

@Component({
  selector: 'app-prospect-comment',
  templateUrl: './prospect-comment.component.html',
  styleUrls: ['./prospect-comment.component.scss'],
  animations: [routerTransition()]
})
export class ProspectCommentComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);
  }

}
