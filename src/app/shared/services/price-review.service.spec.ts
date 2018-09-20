import { TestBed, inject } from '@angular/core/testing';

import { PriceReviewService } from './price-review.service';

describe('PriceReviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceReviewService]
    });
  });

  it('should be created', inject([PriceReviewService], (service: PriceReviewService) => {
    expect(service).toBeTruthy();
  }));
});
