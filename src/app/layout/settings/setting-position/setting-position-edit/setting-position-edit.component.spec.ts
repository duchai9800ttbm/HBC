import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPositionEditComponent } from './setting-position-edit.component';

describe('SettingPositionEditComponent', () => {
  let component: SettingPositionEditComponent;
  let fixture: ComponentFixture<SettingPositionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingPositionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPositionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
