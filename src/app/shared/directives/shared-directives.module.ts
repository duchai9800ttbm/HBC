import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberDirective } from './input-number.directive';
import { InputMoneyDirective } from './input-money.directive';
import { VnCurrencyPipe } from '../pipes/vn-currency-pipe.module';
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
import { InputDateDirective } from './input-date.directive';
import { InputThousandSeparateDirective } from './input-thousand-separate.directive';
import { ThousandSeparate } from '../pipes/thoudand-separate.module';
import { NumberAreaPipeNoplaceholder } from '../pipes/number-area-noplaceholer.pipe';
import { InputAreaNoplaceholderDirective } from './input-area-noplaceholder.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InputNumberDirective,
        InputMoneyDirective,
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
        InputDateDirective,
        InputThousandSeparateDirective,
        InputAreaNoplaceholderDirective
    ],
    exports: [
        InputNumberDirective,
        InputMoneyDirective,
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
        InputDateDirective,
        InputThousandSeparateDirective,
        InputAreaNoplaceholderDirective
    ],
    providers: [
        VnCurrencyPipe,
        NumberAreaPipe,
        ThousandSeparate,
        NumberAreaPipeNoplaceholder
    ]
})
export class SharedDirectivesModule { }
