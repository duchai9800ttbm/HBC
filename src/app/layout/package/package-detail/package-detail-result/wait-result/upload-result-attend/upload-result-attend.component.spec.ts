import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadResultAttendComponent } from './upload-result-attend.component';

describe('UploadResultAttendComponent', () => {
  let component: UploadResultAttendComponent;
  let fixture: ComponentFixture<UploadResultAttendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadResultAttendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadResultAttendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
