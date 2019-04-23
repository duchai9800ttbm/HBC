import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSuccessComponent } from './package-success.component';

describe('PackageSuccessComponent', () => {
  let component: PackageSuccessComponent;
  let fixture: ComponentFixture<PackageSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
