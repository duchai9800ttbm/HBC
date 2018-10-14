import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRowHover]'
})
export class RowHoverDirective {

  oldStyle;
  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(false);
  }

  private highlight(copy: boolean) {
    // console.log('hl');
    const row = this.el.nativeElement as HTMLElement;
    const tdFirst = row.firstElementChild as HTMLElement;
    const tdLast = row.lastElementChild as HTMLElement;
    // console.log(tdFirst);
    // console.log(tdLast);
    if (copy) {
      this.oldStyle = tdFirst.style.backgroundColor;
    }
    tdFirst.style.backgroundColor = 'rgba(0, 0, 0, 0.075)';
    tdLast.style.backgroundColor = 'rgba(0, 0, 0, 0.075)';
    if (!copy) {
      tdFirst.style.backgroundColor = this.oldStyle;
      tdLast.style.backgroundColor = this.oldStyle;
    }
  }

}
