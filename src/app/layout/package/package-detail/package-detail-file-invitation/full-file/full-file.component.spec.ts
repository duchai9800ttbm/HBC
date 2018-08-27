/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FullFileComponent } from './full-file.component';

describe('FullFileComponent', () => {
  let component: FullFileComponent;
  let fixture: ComponentFixture<FullFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
