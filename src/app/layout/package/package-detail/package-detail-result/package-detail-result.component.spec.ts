import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailResultComponent } from './package-detail-result.component';

describe('PackageDetailResultComponent', () => {
  let component: PackageDetailResultComponent;
  let fixture: ComponentFixture<PackageDetailResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDetailResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDetailResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
