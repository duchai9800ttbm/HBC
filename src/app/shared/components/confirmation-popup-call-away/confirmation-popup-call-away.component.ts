import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-popup-call-away',
  templateUrl: './confirmation-popup-call-away.component.html',
  styleUrls: ['./confirmation-popup-call-away.component.scss']
})
export class ConfirmationPopupCallAwayComponent implements OnInit {
  @Input() message: any;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
