import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
@Component({
  selector: 'app-no-permission',
  templateUrl: './no-permission.component.html',
  styleUrls: ['./no-permission.component.scss'],
  animations: [routerTransition()],
})
export class NoPermissionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
