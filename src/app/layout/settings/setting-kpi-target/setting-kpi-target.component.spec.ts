import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingKpiTargetComponent } from './setting-kpi-target.component';

describe('SettingKpiTargetComponent', () => {
  let component: SettingKpiTargetComponent;
  let fixture: ComponentFixture<SettingKpiTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingKpiTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingKpiTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
