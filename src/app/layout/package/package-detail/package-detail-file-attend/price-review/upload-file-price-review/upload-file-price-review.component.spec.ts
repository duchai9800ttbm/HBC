import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilePriceReviewComponent } from './upload-file-price-review.component';

describe('UploadFilePriceReviewComponent', () => {
  let component: UploadFilePriceReviewComponent;
  let fixture: ComponentFixture<UploadFilePriceReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFilePriceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFilePriceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
