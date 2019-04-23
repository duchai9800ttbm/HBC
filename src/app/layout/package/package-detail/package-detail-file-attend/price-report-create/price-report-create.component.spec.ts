import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReportCreateComponent } from './price-report-create.component';

describe('PriceReportCreateComponent', () => {
  let component: PriceReportCreateComponent;
  let fixture: ComponentFixture<PriceReportCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReportCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
