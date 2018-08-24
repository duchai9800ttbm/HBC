import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-upload-file-hsdt',
  templateUrl: './upload-file-hsdt.component.html',
  styleUrls: ['./upload-file-hsdt.component.scss']
})
export class UploadFileHsdtComponent implements OnInit {
  @Input() nameFile: string;
  @Input() callBack: Function;
  constructor() { }
  ngOnInit() {
  }

  closePopup() {
    this.callBack();
  }

}
