import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingConstructionCategoryRoutingModule } from './setting-construction-category-routing.module';
import { SettingConstructionCategoryListComponent } from './setting-construction-category-list/setting-construction-category-list.component';
import { SettingConstructionCategoryFormComponent } from './setting-construction-category-form/setting-construction-category-form.component';
import { SettingConstructionCategoryCreateComponent } from './setting-construction-category-create/setting-construction-category-create.component';
import { SharedModule } from '../../../shared/shared.module';
import { SettingConstructionCategoryEditComponent } from './setting-construction-category-edit/setting-construction-category-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SettingConstructionCategoryRoutingModule,
    SharedModule
  ],
  declarations: [SettingConstructionCategoryListComponent, SettingConstructionCategoryFormComponent, SettingConstructionCategoryCreateComponent, SettingConstructionCategoryEditComponent]
})
export class SettingConstructionCategoryModule { }
