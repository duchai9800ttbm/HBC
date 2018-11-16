import { DataTablesModule } from 'angular-datatables';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DateTimePickerModule } from 'ng-pick-datetime';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SharedComponentsModule } from './components/shared-components.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbCollapseModule, NgbAlertModule, NgbDropdownModule, NgbModalModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteModule, DropdownModule } from 'primeng/primeng';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { AuthGuard, ApiService, DataService, UserService } from './services/index';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip/tooltip.module';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { FormInputModule } from './modules/form-input/form-input.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TagInputModule } from 'ngx-chips';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MenuModule } from '@progress/kendo-angular-menu';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CKEditorModule } from 'ng2-ckeditor';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
// Imports the ComboBox module
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
// Imports the Button module
import { ButtonModule } from '@progress/kendo-angular-buttons';

// Imports the ButtonGroup module
import { ButtonGroupModule } from '@progress/kendo-angular-buttons';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { HttpClientModule } from '@angular/common/http';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from '../../../node_modules/ngx-bootstrap';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
@NgModule({
    imports: [
        HttpClientModule,
        UploadModule,
        InputsModule,
        PDFExportModule,
        ButtonModule,
        ButtonGroupModule,
        DateInputsModule,
        ComboBoxModule,
        TagInputModule,
        FilterPipeModule,
        NgxSpinnerModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MomentModule,
        NgbCarouselModule.forRoot(),
        NgbDropdownModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbCollapseModule.forRoot(),
        NgbModalModule.forRoot(),
        NgbTooltipModule.forRoot(),
        AutoCompleteModule,
        DropdownModule,
        DataTablesModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        CommentsModule,
        FormInputModule,
        SharedComponentsModule,
        SharedPipesModule,
        SharedDirectivesModule,
        ButtonsModule,
        DialogsModule,
        GridModule,
        DropDownsModule,
        MenuModule,
        ModalModule.forRoot(),
        CKEditorModule,
        NgSelectModule,
        BsDropdownModule.forRoot(),
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.threeBounce,
            backdropBackgroundColour: 'rgba(0,0,0,0)',
            backdropBorderRadius: '3px',
            primaryColour: '#00a0e3',
            secondaryColour: '#00a0e3',
            tertiaryColour: '#00a0e3'
        })
        // ScrollToTopService
    ],
    exports: [
        HttpClientModule,
        UploadModule,
        InputsModule,
        PDFExportModule,
        ButtonModule,
        ButtonGroupModule,
        ComboBoxModule,
        DateInputsModule,
        FilterPipeModule,
        NgxSpinnerModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        NgbCarouselModule,
        NgbDropdownModule,
        NgbAlertModule,
        NgbCollapseModule,
        NgbModalModule,
        NgbTooltipModule,
        TranslateModule,
        DataTablesModule,
        AutoCompleteModule,
        DropdownModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        CommentsModule,
        FormInputModule,
        SharedComponentsModule,
        SharedPipesModule,
        SharedDirectivesModule,
        ButtonsModule,
        DialogsModule,
        GridModule,
        DropDownsModule,
        MenuModule,
        NgSelectModule,
        BsDropdownModule,
        NgxLoadingModule
        // ScrollToTopService
    ]
})
export class SharedModule { }
