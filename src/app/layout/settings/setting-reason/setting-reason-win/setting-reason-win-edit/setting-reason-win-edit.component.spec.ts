import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingReasonWinEditComponent } from './setting-reason-win-edit.component';

describe('SettingReasonWinEditComponent', () => {
  let component: SettingReasonWinEditComponent;
  let fixture: ComponentFixture<SettingReasonWinEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingReasonWinEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingReasonWinEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
