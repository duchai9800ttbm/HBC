import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-col-spin',
    templateUrl: './col-spin.component.html',
    styleUrls: ['./col-spin.component.scss']
})
export class ColSpinComponent implements OnInit {
    @ViewChild('tablePin') tablePin: ElementRef;
    @ViewChild('fakeScrollBar') fakeScrollBar: ElementRef;
    tableArr = [];
    colHide = [];
    constructor() {}

    ngOnInit() {
        let i = 0;
        while (i < 20) {
            this.tableArr.push(i);
            i++;
        }
        setTimeout(() => {
          const table = this.tablePin.nativeElement as HTMLElement;
          const scrollBar = this.fakeScrollBar.nativeElement as HTMLElement;
          scrollBar.style.width = table.offsetWidth + 'px';
      });
    }

    syncScroll1(wrap1: HTMLElement, wrap2: HTMLElement) {
        wrap2.scrollLeft = wrap1.scrollLeft;
    }

    syncScroll2(wrap1: HTMLElement, wrap2: HTMLElement) {
        wrap1.scrollLeft = wrap2.scrollLeft;
    }

    getShowOrHide(value: number): boolean {
        return this.colHide.find(i => i === value) ? true : false;
    }

    showOrHideCol(value: number) {
        if (this.colHide.find(i => i === value)) {
            const idx = this.colHide.findIndex(i => i === value);
            this.colHide.splice(idx, 1);
        } else {
            this.colHide.push(value);
        }
        setTimeout(() => {
            const table = this.tablePin.nativeElement as HTMLElement;
            const scrollBar = this.fakeScrollBar.nativeElement as HTMLElement;
            scrollBar.style.width = table.offsetWidth + 'px';
        });
    }
}
