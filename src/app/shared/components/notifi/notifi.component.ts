import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notifi',
  templateUrl: './notifi.component.html',
  styleUrls: ['./notifi.component.scss']
})
export class NotifiComponent implements OnInit {
  @Input() message: any;
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    console.log('message', this.message);
  }

}
