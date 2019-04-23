import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputAssignToComponent } from './input-assign-to/input-assign-to.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
  declarations: [InputAssignToComponent],
  exports: [InputAssignToComponent]
})
export class FormInputModule { }
