import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @Input() message: any;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
