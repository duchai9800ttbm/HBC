import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPositionFormComponent } from './setting-position-form.component';

describe('SettingPositionFormComponent', () => {
  let component: SettingPositionFormComponent;
  let fixture: ComponentFixture<SettingPositionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingPositionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPositionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
