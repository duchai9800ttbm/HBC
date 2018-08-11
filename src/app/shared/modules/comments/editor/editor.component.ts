import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @Input() editMode: boolean;
  @Input() showControls: boolean;
  @Input() editSaved: any;
  @Input() content: any;
  constructor() { }

  ngOnInit() {
  }

  setEditableContent(text: string) {
    this.content = text;
  }

  getEditableContent() {
    return this.content;
  }

}
