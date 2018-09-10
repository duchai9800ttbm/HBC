import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailUploadFileComponent } from './detail-upload-file.component';

describe('DetailUploadFileComponent', () => {
  let component: DetailUploadFileComponent;
  let fixture: ComponentFixture<DetailUploadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailUploadFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
