import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCallComponent } from './customer-call.component';

describe('CustomerCallComponent', () => {
  let component: CustomerCallComponent;
  let fixture: ComponentFixture<CustomerCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
