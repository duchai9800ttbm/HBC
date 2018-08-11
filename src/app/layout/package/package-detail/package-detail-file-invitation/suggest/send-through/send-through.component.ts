import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-send-through',
  templateUrl: './send-through.component.html',
  styleUrls: ['./send-through.component.scss']
})
export class SendThroughComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();
  constructor() { }

  public close(status) {
    if (status === 'yes') {
      this.closed.emit(true);
    }
    if (status === 'cancel') {
      this.closed.emit(false);
    }
  }
  ngOnInit() {
  }

}
