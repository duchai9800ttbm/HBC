import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageEditComponent } from './package-edit.component';

describe('PackageEditComponent', () => {
  let component: PackageEditComponent;
  let fixture: ComponentFixture<PackageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
