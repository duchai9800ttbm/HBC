import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailInfoComponent } from './package-detail-info.component';

describe('PackageDetailInfoComponent', () => {
  let component: PackageDetailInfoComponent;
  let fixture: ComponentFixture<PackageDetailInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDetailInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
