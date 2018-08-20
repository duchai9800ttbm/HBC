import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-package-email',
  templateUrl: './package-email.component.html',
  styleUrls: ['./package-email.component.scss'],
  animations: [routerTransition()]
})
export class PackageEmailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
