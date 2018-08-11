import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingReasonLoseEditComponent } from './setting-reason-lose-edit.component';

describe('SettingReasonLoseEditComponent', () => {
  let component: SettingReasonLoseEditComponent;
  let fixture: ComponentFixture<SettingReasonLoseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingReasonLoseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingReasonLoseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
