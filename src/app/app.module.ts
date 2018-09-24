import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy, registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// tslint:disable-next-line:max-line-length
import { AuthGuard, SessionService, ConfirmationService, InstantSearchService, UserNotificationService, ApiService, DataService, UserService } from './shared/services';
import { AlertService } from './shared/services';
import { HttpModule } from '@angular/http';
import { SharedModule } from './shared/shared.module';
import { AlertComponent } from './shared/components/alert/alert.component';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { StarRatingModule } from 'angular-star-rating';
import { DataUploadService } from './shared/services/data-upload.service';
// import { GroupUserService } from './shared/services/group-user.service';
import { LiveformDataReportService } from './shared/services/liveform-data-report.service';
import '@progress/kendo-angular-intl/locales/vi/all';
import { IntlModule } from '@progress/kendo-angular-intl';
import '@angular/common/locales/vi';
import { MessageService } from '../../node_modules/@progress/kendo-angular-l10n';
import { MyMessageService } from './my-message.service';
import localeFrCa from '@angular/common/locales/vi';
import localeFrCaExtra from '@angular/common/locales/extra/vi';
import { WindowService } from '@progress/kendo-angular-dialog';
import { FengShuisInforService } from './shared/services/feng-shuis-infor.service';
import { PackageService } from './shared/services/package.service';
import { DocumentService } from './shared/services/document.service';
import { ScrollToTopService } from './shared/services/scroll-to-top.service';
import { OpportunityHsmtService } from './shared/services/opportunity-hsmt.service';
import { DocumentReviewService } from './shared/services/document-review.service';
import { SettingService } from './shared/services/setting.service';
import { PackageSuccessService } from './shared/services/package-success.service';
import { EmailService } from './shared/services/email.service';
import { LayoutService } from './shared/services/layout.service';
import '@progress/kendo-ui';
import { NG_SELECT_DEFAULT_CONFIG } from '../../node_modules/@ng-select/ng-select';
import { NotificationService } from './shared/services/notification.service';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeFrCa, localeFrCaExtra);

@NgModule({
    imports: [
        IntlModule,
        // StarRatingModule.forRoot(),
        CommonModule,
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        NgxSpinnerModule
    ],
    declarations: [AppComponent, AlertComponent],
    bootstrap: [AppComponent],
    providers: [
        AlertService,
        SessionService,
        ConfirmationService,
        InstantSearchService,
        UserNotificationService,
        NotificationService,
        LiveformDataReportService,
        DataUploadService,
        TranslateService,
        AuthGuard,
        ApiService,
        DataService,
        UserService,
        WindowService,
        FengShuisInforService,
        PackageService,
        DocumentService,
        ScrollToTopService,
        OpportunityHsmtService,
        DocumentReviewService,
        SettingService,
        PackageSuccessService,
        EmailService,
        LayoutService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {
            // Set default locale to bg-BG
            provide: LOCALE_ID, useValue: 'vi'
        },
        { provide: MessageService, useClass: MyMessageService },
        {
            provide: NG_SELECT_DEFAULT_CONFIG,
            useValue: {
                notFoundText: 'Custom not found'
            }
        }
    ],
})
export class AppModule { }
