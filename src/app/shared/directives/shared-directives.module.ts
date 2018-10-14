import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberDirective } from './input-number.directive';
import { InputMoneyDirective } from './input-money.directive';
import { VnCurrencyPipe } from '../pipes/vn-currency-pipe.module';
import { PhoneNumberCallableDirective } from './phone-number-callable.directive';
import { SameWidthDirective } from './same-width.directive';
import { InputAreaDirective } from './input-area.directive';
import { NumberAreaPipe } from '../pipes/number-area.pipe';
import { SquareBoxDirective } from './square-box.directive';
import { TextEllipsisDirective } from './text-ellipsis.directive';
import { EnterPreventDefaultDirective } from './enter-prevent-default.directive';
import { InputNumberIntegerDirective } from './input-number-integer.directive';
import { WidthAutoDirective } from './width-auto.directive';
import { AutoFocusDirective } from './auto-focus.directive';
import { InputNumberNegativeDecimalDirective } from './input-number-negative-decimal.directive';
import { RowHoverDirective } from './row-hover.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InputNumberDirective,
        InputMoneyDirective,
        PhoneNumberCallableDirective,
        SameWidthDirective,
        InputAreaDirective,
        SquareBoxDirective,
        TextEllipsisDirective,
        EnterPreventDefaultDirective,
        InputNumberIntegerDirective,
        WidthAutoDirective,
        AutoFocusDirective,
        InputNumberNegativeDecimalDirective,
        RowHoverDirective,
    ],
    exports: [
        InputNumberDirective,
        InputMoneyDirective,
        PhoneNumberCallableDirective,
        SameWidthDirective,
        InputAreaDirective,
        SquareBoxDirective,
        TextEllipsisDirective,
        EnterPreventDefaultDirective,
        InputNumberIntegerDirective,
        WidthAutoDirective,
        AutoFocusDirective,
        InputNumberNegativeDecimalDirective,
        RowHoverDirective
    ],
    providers: [
        VnCurrencyPipe,
        NumberAreaPipe
    ]
})
export class SharedDirectivesModule { }
