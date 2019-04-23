import { Directive, ElementRef, HostListener, AfterViewChecked } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[textEllipsis]'
})
export class TextEllipsisDirective implements AfterViewChecked {

  constructor(private el: ElementRef) { }

  ngAfterViewChecked(): void {
    this.checkEllipsis(this.el.nativeElement);
  }

  @HostListener('window:resize')
    onResize() {
        // call our matchWidth function here later
        this.checkEllipsis(this.el.nativeElement);
    }

    checkEllipsis(parent: HTMLElement) {
        // match width logic here
        if (!parent) {
          return;
        }
        // find width
        const fontSize = parent.style.fontSize;
        if (parent.offsetHeight > (Number(fontSize) / 2)) {
          parent.style.textOverflow = 'ellipsis';
          parent.style.overflowX = 'hidden';
          parent.style.whiteSpace = 'nowrap';
        }
    }

}
