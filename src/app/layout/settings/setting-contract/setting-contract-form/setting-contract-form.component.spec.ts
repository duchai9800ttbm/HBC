import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingContractFormComponent } from './setting-contract-form.component';

describe('SettingContractFormComponent', () => {
  let component: SettingContractFormComponent;
  let fixture: ComponentFixture<SettingContractFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingContractFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingContractFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
