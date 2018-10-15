import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadKickOffComponent } from './upload-kick-off.component';

describe('UploadKickOffComponent', () => {
  let component: UploadKickOffComponent;
  let fixture: ComponentFixture<UploadKickOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadKickOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadKickOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
