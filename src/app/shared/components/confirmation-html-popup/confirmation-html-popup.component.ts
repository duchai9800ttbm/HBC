import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-html-popup',
  templateUrl: './confirmation-html-popup.component.html',
  styleUrls: ['./confirmation-html-popup.component.scss']
})
export class ConfirmationHtmlPopupComponent implements OnInit {
  @Input() message: any;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
