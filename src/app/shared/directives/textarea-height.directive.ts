import {
    Directive,
    OnInit,
    Renderer,
    ElementRef
} from '@angular/core';
import { ThousandSeparate } from '../pipes/thoudand-separate.module';

@Directive({
    selector: '[appTextareaHeight]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        // '(blur)': 'setHeight($event.target.value)',
        '(focus)': 'autoHeight($event.target.value)',
        '(keyup)': 'autoHeight($event.target.value)',
    }
})
export class TextareaHeightDirective implements OnInit {
    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private thousandSeparate: ThousandSeparate,
    ) {
        // el.nativeElement.style.height = '28px';
        el.nativeElement.style.overflow = 'hidden';
    }

    ngOnInit() {
        if (this.el.nativeElement.scrollHeight < 29) {
            this.el.nativeElement.style.height = '28px';
        } else {
            this.el.nativeElement.style.height = 'auto';
            this.el.nativeElement.style.height = this.el.nativeElement.scrollHeight + 'px';
        }
    }

    // setHeight(value) {
    //     this.el.nativeElement.style.height = '28px';
    // }

    autoHeight(value) {
        if (this.el.nativeElement.scrollHeight < 29) {
            this.el.nativeElement.style.height = '28px';
        } else {
            this.el.nativeElement.style.height = 'auto';
            this.el.nativeElement.style.height = this.el.nativeElement.scrollHeight + 'px';
        }
    }

}
