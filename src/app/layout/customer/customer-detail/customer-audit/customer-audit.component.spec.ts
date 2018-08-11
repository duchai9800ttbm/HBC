import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAuditComponent } from './customer-audit.component';

describe('CustomerAuditComponent', () => {
  let component: CustomerAuditComponent;
  let fixture: ComponentFixture<CustomerAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
