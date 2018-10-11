import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadContractSigningComponent } from './upload-contract-signing.component';

describe('UploadContractSigningComponent', () => {
  let component: UploadContractSigningComponent;
  let fixture: ComponentFixture<UploadContractSigningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadContractSigningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadContractSigningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
