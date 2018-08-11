import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingReasonRejectEditComponent } from './setting-reason-reject-edit.component';

describe('SettingReasonRejectEditComponent', () => {
  let component: SettingReasonRejectEditComponent;
  let fixture: ComponentFixture<SettingReasonRejectEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingReasonRejectEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingReasonRejectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
