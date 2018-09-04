import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveformSiteReportComponent } from './liveform-site-report.component';

describe('LiveformSiteReportComponent', () => {
  let component: LiveformSiteReportComponent;
  let fixture: ComponentFixture<LiveformSiteReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveformSiteReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveformSiteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
