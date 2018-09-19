import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReviewEditComponent } from './price-review-edit.component';

describe('PriceReviewEditComponent', () => {
  let component: PriceReviewEditComponent;
  let fixture: ComponentFixture<PriceReviewEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReviewEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReviewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
