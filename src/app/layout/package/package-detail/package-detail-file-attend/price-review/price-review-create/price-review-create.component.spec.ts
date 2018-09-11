import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReviewCreateComponent } from './price-review-create.component';

describe('PriceReviewCreateComponent', () => {
  let component: PriceReviewCreateComponent;
  let fixture: ComponentFixture<PriceReviewCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReviewCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReviewCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
