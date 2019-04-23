import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReportSubmitedComponent } from './price-report.component';

describe('PriceReportComponent', () => {
  let component: PriceReportSubmitedComponent;
  let fixture: ComponentFixture<PriceReportSubmitedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReportSubmitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReportSubmitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
