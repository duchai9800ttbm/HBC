import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissPackageNoticeDetailComponent } from './miss-package-notice-detail.component';

describe('MissPackageNoticeDetailComponent', () => {
  let component: MissPackageNoticeDetailComponent;
  let fixture: ComponentFixture<MissPackageNoticeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissPackageNoticeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissPackageNoticeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
