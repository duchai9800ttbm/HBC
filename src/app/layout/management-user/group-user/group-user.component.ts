import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
@Component({
  selector: 'app-group-user',
  templateUrl: './group-user.component.html',
  styleUrls: ['./group-user.component.scss'],
  animations: [routerTransition()]
})
export class GroupUserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
