import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReviewSummaryComponent } from './price-review-summary.component';

describe('PriceReviewSummaryComponent', () => {
  let component: PriceReviewSummaryComponent;
  let fixture: ComponentFixture<PriceReviewSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReviewSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReviewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
