import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileHsdtComponent } from './upload-file-hsdt.component';

describe('UploadFileHsdtComponent', () => {
  let component: UploadFileHsdtComponent;
  let fixture: ComponentFixture<UploadFileHsdtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFileHsdtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileHsdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
