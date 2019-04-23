import {
    Directive,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef,
    HostListener,
    Renderer,
    ElementRef
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[appInputNumber]' })
export class InputNumberDirective implements OnInit {

    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private viewContainer: ViewContainerRef,
        private ngControl: NgControl,
    ) {
        // this.renderer.setElementAttribute(this.el.nativeElement, 'maxlength', PHONE_NUMBER_MAX_LENGHT);
        // this.renderer.setElementAttribute(this.el.nativeElement, 'onkeypress', 'return event.charCode >= 48 && event.charCode <= 57');
    }

    ngOnInit() {
    }

    getKey(e: KeyboardEvent) {
        return e.keyCode || e.charCode;
    }

    getCharCode(e: KeyboardEvent) {
        return e.charCode || e.keyCode || e.which;
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(e: KeyboardEvent) {


        if (e.ctrlKey || e.altKey) {
            return;
        }

        let k = this.getKey(e);

        let c = this.getCharCode(e);
        let cc = String.fromCharCode(c);
        let ok = true;


        ok = /[\d\.]/.test(cc);

        if (!ok) {
            e.preventDefault();
        }
    }
}
