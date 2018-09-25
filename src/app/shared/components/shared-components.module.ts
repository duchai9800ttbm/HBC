import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationSummaryComponent } from './validation-summary/validation-summary.component';
import { ListErrorsComponent } from './list-errors/index';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { AlertComponent } from './alert/alert.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { FooterCopyrightComponent } from './footer-copyright/footer-copyright.component';
import { ConvertProspect2Component } from './convert-prospect2/convert-prospect2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbAlertModule, NgbModalModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPopupCallAwayComponent } from './confirmation-popup-call-away/confirmation-popup-call-away.component';
import { FengShuisInforComponent } from './feng-shuis-infor/feng-shuis-infor.component';
import { PoupRejectPackageComponent } from './poup-reject-package/poup-reject-package.component';
import { PopupCreateAssignerComponent } from './popup-create-assigner/popup-create-assigner.component';
import { PopupCreateChairComponent } from './popup-create-chair/popup-create-chair.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PrintEmailComponent } from './print-email/print-email.component';
// Imports the Button module
import { ButtonModule } from '@progress/kendo-angular-buttons';

// Imports the ButtonGroup module
import { ButtonGroupModule } from '@progress/kendo-angular-buttons';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
@NgModule({
    imports: [
        PDFExportModule,
        ButtonGroupModule,
        ButtonModule,
        CommonModule,
        SharedPipesModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgbDropdownModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbCollapseModule.forRoot(),
        NgbModalModule.forRoot(),
    ],
    declarations: [
        // AlertComponent,
        ValidationSummaryComponent,
        ListErrorsComponent,
        ConfirmationPopupComponent,
        PaginationComponent,
        FooterCopyrightComponent,
        ConvertProspect2Component,
        ConfirmationPopupCallAwayComponent,
        FengShuisInforComponent,
        PoupRejectPackageComponent,
        PopupCreateAssignerComponent,
        PopupCreateChairComponent,
        ResetPasswordComponent,
        PrintEmailComponent,
        ImageCarouselComponent,
    ],
    exports: [
        // AlertComponent,
        ValidationSummaryComponent,
        ListErrorsComponent,
        ConfirmationPopupComponent,
        PaginationComponent,
        FooterCopyrightComponent,
        ConvertProspect2Component,
        ConfirmationPopupCallAwayComponent,
        PoupRejectPackageComponent,
        PopupCreateAssignerComponent,
        PopupCreateChairComponent,
        ResetPasswordComponent,
        PrintEmailComponent,
        ImageCarouselComponent
    ],
    entryComponents: [
        ConfirmationPopupComponent,
        ConvertProspect2Component,
        ConfirmationPopupCallAwayComponent,
        FengShuisInforComponent,
        PoupRejectPackageComponent,
        PopupCreateAssignerComponent,
        PopupCreateChairComponent,
        ResetPasswordComponent,
        PrintEmailComponent
    ]
})
export class SharedComponentsModule { }
