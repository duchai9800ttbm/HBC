import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnInit
} from '@angular/core';

@Directive({
    selector: '[appInputNumberNegativeDecimal]'
})
export class InputNumberNegativeDecimalDirective implements OnInit {
    @Input('negative')
    negative: boolean;
    @Input('decimal')
    decimal: boolean;
    @Input('min')
    min: number;
    @Input('max')
    max: number;
    constructor(private _el: ElementRef) {}

    ngOnInit() {}

    @HostListener('input', ['$event'])
    onInputChange(event) {
        let regex = null;
        if (this.decimal) {
            regex = /[^0-9\.]*/g;
        } else {
            regex = /[^0-9]*/g;
        }
        let initalValue = this._el.nativeElement.value as String;
        const l = initalValue.match(/\./g) || [];
        // chỉ cho nhập 1 dấu .
        if (l.length === 2) {
            initalValue = initalValue.substring(0, initalValue.length - 1);
        }
        let valueReplace = initalValue.replace(regex, '');
        if (initalValue.includes('-') && this.negative) {
            valueReplace = '-' + valueReplace;
        }
        if (
            (valueReplace.substring(0, 1) === '-' &&
                valueReplace.substring(1, 1) === '0' &&
                Number(valueReplace) >= 1) ||
            (valueReplace.substring(0, 1) === '0' && Number(valueReplace) >= 1)
        ) {
            valueReplace = valueReplace.replace('0', '');
        }
        if (this.min && Number(valueReplace) < this.min) {
            valueReplace = this.min + '';
        }
        if (this.max && Number(valueReplace) > this.max) {
            valueReplace = this.max + '';
        }
        this._el.nativeElement.value = valueReplace;
        if (initalValue !== this._el.nativeElement.value) {
            // event.stopPropagation();
        }
    }
}
