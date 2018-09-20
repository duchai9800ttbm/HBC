import { TestBed, inject } from '@angular/core/testing';

import { LiveformDataReportService } from './liveform-data-report.service';

describe('LiveformDataReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiveformDataReportService]
    });
  });

  it('should be created', inject([LiveformDataReportService], (service: LiveformDataReportService) => {
    expect(service).toBeTruthy();
  }));
});
