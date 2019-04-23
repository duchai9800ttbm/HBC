import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDocumentListComponent } from './transfer-document-list.component';

describe('TransferDocumentListComponent', () => {
  let component: TransferDocumentListComponent;
  let fixture: ComponentFixture<TransferDocumentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferDocumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
