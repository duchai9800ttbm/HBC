import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReviewFormComponent } from './price-review-form.component';

describe('PriceReviewFormComponent', () => {
  let component: PriceReviewFormComponent;
  let fixture: ComponentFixture<PriceReviewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReviewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
