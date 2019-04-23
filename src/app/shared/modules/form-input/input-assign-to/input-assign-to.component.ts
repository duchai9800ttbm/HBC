import { Component, OnInit, forwardRef } from '@angular/core';
import { SelectControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { DataService } from '../../../services/index';
import { SelectItemWithType } from '../../../models/select-item-with-type';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-input-assign-to',
  templateUrl: './input-assign-to.component.html',
  styleUrls: ['./input-assign-to.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAssignToComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputAssignToComponent),
      multi: true,
    }
  ],
})
export class InputAssignToComponent implements OnInit, ControlValueAccessor {
  assignToList: Observable<SelectItemWithType[]>;

  value: SelectItemWithType[];

  onModelChange: Function = () => { };

  onModelTouched: Function = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean): void {
    // this.disabled = val;
  }


  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    // this.assignToList = this.dataService.getAssignToItems();
  }

  compareSelectItemWithType(o1: SelectItemWithType, o2: SelectItemWithType): Boolean {
    return (!o1 || !o2) || (o1.type === o2.type && o1.id === o2.id);
  }

}
