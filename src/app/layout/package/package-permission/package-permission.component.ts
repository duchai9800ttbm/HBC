import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-package-permission',
  templateUrl: './package-permission.component.html',
  styleUrls: ['./package-permission.component.scss'],
  animations: [routerTransition()]
})
export class PackagePermissionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
