import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCustomerHistoryComponent } from './contact-customer-history.component';

describe('ContactCustomerHistoryComponent', () => {
  let component: ContactCustomerHistoryComponent;
  let fixture: ComponentFixture<ContactCustomerHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactCustomerHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCustomerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
