import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDocumentSenderComponent } from './package-document-sender.component';

describe('PackageDocumentSenderComponent', () => {
  let component: PackageDocumentSenderComponent;
  let fixture: ComponentFixture<PackageDocumentSenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDocumentSenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDocumentSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
