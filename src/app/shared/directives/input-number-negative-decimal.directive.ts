import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    Renderer
} from '@angular/core';
import { NgControl } from '../../../../node_modules/@angular/forms';
import { VnCurrencyPipe } from '../pipes/vn-currency-pipe.module';
import { AlertService } from '../services';
const PADDING = '000000';
@Directive({
    selector: '[appInputNumberNegativeDecimal]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(blur)': 'formatInputValue($event.target.value)',
        '(focus)': 'formatToNumber($event.target.value)',
        '(paste)': 'pasteNumber($event)'
    },
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
    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;
    private CURRENCY_UNIT: string;
    private MAX_LENGTH: number;
    constructor(
        private _el: ElementRef,
        private ngControl: NgControl,
        private vnCurrencyPipe: VnCurrencyPipe,
        private renderer: Renderer,
        private alertService: AlertService,
    ) {
        this.DECIMAL_SEPARATOR = '.';
        this.THOUSANDS_SEPARATOR = ',';
        this.CURRENCY_UNIT = ' đ';
        this.MAX_LENGTH = 17;
        this.renderer.setElementAttribute(this._el.nativeElement, 'maxlength', this.MAX_LENGTH.toString());
        // this.decimal ? (this.MAX_LENGTH + 3).toString() :
    }

    ngOnInit() {
        this.ngControl.valueAccessor.writeValue(this.transformNotDenominations(this.ngControl.value));
    }

    formatInputValue(value) {
        this.ngControl.valueAccessor.writeValue(this.transformNotDenominations(value));
    }

    formatToNumber(value) {
        this.ngControl.valueAccessor.writeValue(this.vnCurrencyPipe.parse(value));
    }

    transformNotDenominations(value: number | string, fractionSize: number = 2): string {
        if (!value) { return ''; }
        if (isNaN(+value)) {
            // this.alertService.error('Số liệu nhập không phải kiểu số');
            return value.toString();
        }
        let [integer, fraction = ''] = (+value).toString()
            .split(this.DECIMAL_SEPARATOR);
        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : '';
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);
        return integer + fraction;
    }

    parse(value: string, fractionSize: number = 2): number {
        if (!isNaN(+value)) { return +value; }
        let integer = (value || '').replace(this.CURRENCY_UNIT, '');
        integer = integer.split(this.THOUSANDS_SEPARATOR).join('');
        return +integer;
    }

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

    @HostListener('keypress', ['$event'])
    onKeyPress(e: KeyboardEvent) {
        const initalValue = this._el.nativeElement.value as String;

        // chỉ cho nhập 1 dấu .
        const l = initalValue.match(/\./g) || [];
        if (this.decimal && ((l.length === 1 && e.key === '.') || !(((e.charCode >= 48 && e.charCode <= 57) || (e.charCode === 46))))) {
            e.preventDefault();
        }

        // // max length for phần nguyên không lớn hơn 18 số
        // if (this.decimal && initalValue && !isNaN(+initalValue)) {
        //     const [integer, fraction = ''] = (+initalValue).toString()
        //         .split(this.DECIMAL_SEPARATOR);
        //     if (integer.length >= this.MAX_LENGTH) {
        //         e.preventDefault();
        //     }
        // } else {
        //     if (initalValue.length >= this.MAX_LENGTH) {
        //         e.preventDefault();
        //     }
        // }

    }


    pasteNumber(event: ClipboardEvent) {
        const clipboardData = event.clipboardData;
        // || window.clipboardData;
        const pastedText = clipboardData.getData('text');
        if (!Number(pastedText)) {
            this.alertService.error('Số liệu nhập không phải kiểu số');
        }
    }
}
