import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOpportunityComponent } from './customer-opportunity.component';

describe('CustomerOpportunityComponent', () => {
  let component: CustomerOpportunityComponent;
  let fixture: ComponentFixture<CustomerOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
