import { EditorComponent } from '../editor/editor.component';
import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { CommentModel } from '../comment.model';
import * as moment from 'moment';
import { SessionService } from '../../../services/index';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() moduleName: string;
  @Input() moduleItemId: number;
  @Input() comment: CommentModel;
  @Input() commentList: CommentModel[];

  @Input() index: number;

  constructor(
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
  }

}
