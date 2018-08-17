import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDocumentComponent } from './transfer-document.component';

describe('TransferDocumentComponent', () => {
  let component: TransferDocumentComponent;
  let fixture: ComponentFixture<TransferDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
