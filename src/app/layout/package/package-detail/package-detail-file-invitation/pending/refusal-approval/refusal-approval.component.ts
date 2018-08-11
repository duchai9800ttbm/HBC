import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-refusal-approval',
  templateUrl: './refusal-approval.component.html',
  styleUrls: ['./refusal-approval.component.scss']
})
export class RefusalApprovalComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();
  refusalApproval: FormGroup;
   listReason = [
    {
      id: 1,
      text: 'Không đủ thời gian',
    },
    {
      id: 2,
      text: 'Không đủ nhân công',
    },
    {
      id: 3,
      text: 'Không đủ kinh phí',
    },
    {
      id: 4,
      text: 'Dự án không đủ lớn',
    }
  ];
  constructor(
    private fb: FormBuilder,
  ) { }

  public close() {
    this.closed.emit(false);
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.refusalApproval = this.fb.group({
      reason: '',
      description: '',
    });
  }

  submitForm() {
    this.closed.emit(true);
  }
}
