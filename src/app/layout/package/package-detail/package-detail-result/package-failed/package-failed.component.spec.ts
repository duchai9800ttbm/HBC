import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageFailedComponent } from './package-failed.component';

describe('PackageFailedComponent', () => {
  let component: PackageFailedComponent;
  let fixture: ComponentFixture<PackageFailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageFailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
