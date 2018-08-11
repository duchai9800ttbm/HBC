import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractSignedComponent } from './contract-signed.component';

describe('ContractSignedComponent', () => {
  let component: ContractSignedComponent;
  let fixture: ComponentFixture<ContractSignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractSignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractSignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
