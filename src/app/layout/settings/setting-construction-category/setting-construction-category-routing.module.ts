import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { SettingConstructionCategoryListComponent } from './setting-construction-category-list/setting-construction-category-list.component';
import { SettingConstructionCategoryCreateComponent } from './setting-construction-category-create/setting-construction-category-create.component';
// tslint:disable-next-line:max-line-length
import { SettingConstructionCategoryEditComponent } from './setting-construction-category-edit/setting-construction-category-edit.component';

const routes: Routes = [
    {
        path: '',
        component: SettingConstructionCategoryListComponent
    },
    {
        path: 'create',
        component: SettingConstructionCategoryCreateComponent
    },
    {
        path: 'edit/:id',
        component: SettingConstructionCategoryEditComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingConstructionCategoryRoutingModule {}
