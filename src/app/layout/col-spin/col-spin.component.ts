import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-col-spin',
  templateUrl: './col-spin.component.html',
  styleUrls: ['./col-spin.component.scss']
})
export class ColSpinComponent implements OnInit {

  tableArr = [];
  constructor(

  ) { }

  ngOnInit() {
    let i = 0;
    while (i < 20) {
      this.tableArr.push(i);
      i++;
    }
  }

  syncScroll1(wrap1: HTMLElement, wrap2: HTMLElement) {
    wrap2.scrollLeft = wrap1.scrollLeft;
  }

  syncScroll2(wrap1: HTMLElement, wrap2: HTMLElement) {
    wrap1.scrollLeft = wrap2.scrollLeft;
  }

}
