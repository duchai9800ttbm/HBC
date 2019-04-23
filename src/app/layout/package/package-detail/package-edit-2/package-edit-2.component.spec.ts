import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageEdit2Component } from './package-edit-2.component';

describe('PackageEdit2Component', () => {
  let component: PackageEdit2Component;
  let fixture: ComponentFixture<PackageEdit2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageEdit2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageEdit2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
