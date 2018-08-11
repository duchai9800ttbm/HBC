import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryReceiptWindowComponent } from './delivery-receipt-window.component';

describe('DeliveryReceiptWindowComponent', () => {
  let component: DeliveryReceiptWindowComponent;
  let fixture: ComponentFixture<DeliveryReceiptWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryReceiptWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryReceiptWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
