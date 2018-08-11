import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoupRejectPackageComponent } from './poup-reject-package.component';

describe('PoupRejectPackageComponent', () => {
  let component: PoupRejectPackageComponent;
  let fixture: ComponentFixture<PoupRejectPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoupRejectPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoupRejectPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
