import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationComponent } from './information/information.component';
import { EditComponent } from './edit/edit.component';
import { SharedModule } from '../../../../shared/shared.module';
import { PackageDetailInfoRoutingModule } from './package-detail-info-routing.module';
import { PackageDetailInfoComponent } from './package-detail-info.component';
import { CustomerFormComponent } from './edit/customer-form/customer-form.component';
// import { StarRatingModule } from '../../../../../../node_modules/angular-star-rating/dist';
import { UserFormComponent } from './edit/user-form/user-form.component';
import { GroupUserFormComponent } from './edit/user-form/group-user-form/group-user-form.component';
@NgModule({
  imports: [
    // StarRatingModule,
    CommonModule,
    SharedModule,
    CommonModule,
    PackageDetailInfoRoutingModule,
  ],
  declarations: [
    InformationComponent,
    EditComponent,
    PackageDetailInfoComponent,
    CustomerFormComponent,
    UserFormComponent,
    GroupUserFormComponent
    ]
})
export class PackageDetailInfoModule { }
