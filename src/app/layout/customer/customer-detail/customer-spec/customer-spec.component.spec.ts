import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSpecComponent } from './customer-spec.component';

describe('CustomerSpecComponent', () => {
  let component: CustomerSpecComponent;
  let fixture: ComponentFixture<CustomerSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
