import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailReportComponent } from './view-detail-report.component';

describe('ViewDetailReportComponent', () => {
  let component: ViewDetailReportComponent;
  let fixture: ComponentFixture<ViewDetailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDetailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
