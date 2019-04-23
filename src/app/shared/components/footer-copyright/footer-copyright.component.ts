import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-copyright',
  templateUrl: './footer-copyright.component.html',
  styleUrls: ['./footer-copyright.component.scss']
})
export class FooterCopyrightComponent implements OnInit {
  currentYear = new Date().getFullYear();
  constructor() { }

  ngOnInit() {
  }

}
