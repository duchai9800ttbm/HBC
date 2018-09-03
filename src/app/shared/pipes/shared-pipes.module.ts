import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VnCurrencyPipe } from './vn-currency-pipe.module';
import { FromNowPipe } from './from-now-pipes.module';
import { TimesPipe } from './times-pipe.module';
import { ShortenedName } from './shortened-name-pipe.module';
import { VnNumberPipe } from './vn-number-pipe.module';
import { NumberAreaPipe } from './number-area.pipe';
import { SafeUrlPipe } from './safe-url.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        VnCurrencyPipe,
        FromNowPipe,
        TimesPipe,
        ShortenedName,
        VnNumberPipe,
        NumberAreaPipe,
        SafeUrlPipe
    ],
    exports: [
        VnCurrencyPipe,
        FromNowPipe,
        TimesPipe,
        ShortenedName,
        VnNumberPipe,
        NumberAreaPipe,
        SafeUrlPipe
    ],
})
export class SharedPipesModule { }
