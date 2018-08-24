import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-package-document',
  templateUrl: './package-document.component.html',
  styleUrls: ['./package-document.component.scss']
})
export class PackageDocumentComponent implements OnInit {
  @Input() isContract;
  constructor() { }

  ngOnInit() {
     this.isContract = false;
  }

}
