import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingContractCreateComponent } from './setting-contract-create.component';

describe('SettingContractCreateComponent', () => {
  let component: SettingContractCreateComponent;
  let fixture: ComponentFixture<SettingContractCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingContractCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingContractCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
