import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HsdtBuildRoutingModule } from './hsdt-build-routing.module';
import { HsdtBuildComponent } from './hsdt-build.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { SharedComponentsModule } from '../../../../../shared/components/shared-components.module';
import { HoSoDuThauService } from '../../../../../shared/services/ho-so-du-thau.service';
import { UploadFormComponent } from './upload-form/upload-form.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        HsdtBuildRoutingModule,
        SharedComponentsModule
    ],
    declarations: [
        HsdtBuildComponent,
        UploadFormComponent
    ],
    providers: [
        HoSoDuThauService
    ]
})
export class HsdtBuildModule { }
