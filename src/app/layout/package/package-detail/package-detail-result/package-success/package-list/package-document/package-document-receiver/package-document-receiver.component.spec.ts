import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDocumentReceiverComponent } from './package-document-receiver.component';

describe('PackageDocumentReceiverComponent', () => {
  let component: PackageDocumentReceiverComponent;
  let fixture: ComponentFixture<PackageDocumentReceiverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDocumentReceiverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDocumentReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
