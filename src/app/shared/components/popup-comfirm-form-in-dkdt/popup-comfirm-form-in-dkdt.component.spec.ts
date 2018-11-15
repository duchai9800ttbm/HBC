/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PopupComfirmFormInDkdtComponent } from './popup-comfirm-form-in-dkdt.component';

describe('PopupComfirmFormInDkdtComponent', () => {
  let component: PopupComfirmFormInDkdtComponent;
  let fixture: ComponentFixture<PopupComfirmFormInDkdtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupComfirmFormInDkdtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComfirmFormInDkdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
