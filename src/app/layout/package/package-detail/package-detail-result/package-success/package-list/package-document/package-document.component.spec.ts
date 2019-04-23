import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDocumentComponent } from './package-document.component';

describe('PackageDocumentComponent', () => {
  let component: PackageDocumentComponent;
  let fixture: ComponentFixture<PackageDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
