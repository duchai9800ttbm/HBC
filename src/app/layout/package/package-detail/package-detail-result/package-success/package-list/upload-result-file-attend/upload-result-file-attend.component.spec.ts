import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadResultFileAttendComponent } from './upload-result-file-attend.component';

describe('UploadResultFileAttendComponent', () => {
  let component: UploadResultFileAttendComponent;
  let fixture: ComponentFixture<UploadResultFileAttendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadResultFileAttendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadResultFileAttendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
