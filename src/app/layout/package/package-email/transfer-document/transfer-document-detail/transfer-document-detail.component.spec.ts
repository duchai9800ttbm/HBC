import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDocumentDetailComponent } from './transfer-document-detail.component';

describe('TransferDocumentDetailComponent', () => {
  let component: TransferDocumentDetailComponent;
  let fixture: ComponentFixture<TransferDocumentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferDocumentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
