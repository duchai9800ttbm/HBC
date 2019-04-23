import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReviewDetailComponent } from './price-review-detail.component';

describe('PriceReviewDetailComponent', () => {
  let component: PriceReviewDetailComponent;
  let fixture: ComponentFixture<PriceReviewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReviewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReviewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
