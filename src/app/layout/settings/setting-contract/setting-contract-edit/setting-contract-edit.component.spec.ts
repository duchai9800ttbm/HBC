import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingContractEditComponent } from './setting-contract-edit.component';

describe('SettingContractEditComponent', () => {
  let component: SettingContractEditComponent;
  let fixture: ComponentFixture<SettingContractEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingContractEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingContractEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
