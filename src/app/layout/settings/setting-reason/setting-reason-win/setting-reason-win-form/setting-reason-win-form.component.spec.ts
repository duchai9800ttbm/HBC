import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingReasonWinFormComponent } from './setting-reason-win-form.component';

describe('SettingReasonWinFormComponent', () => {
  let component: SettingReasonWinFormComponent;
  let fixture: ComponentFixture<SettingReasonWinFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingReasonWinFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingReasonWinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
