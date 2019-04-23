import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinPackageNoticeDetailComponent } from './win-package-notice-detail.component';

describe('WinPackageNoticeDetailComponent', () => {
  let component: WinPackageNoticeDetailComponent;
  let fixture: ComponentFixture<WinPackageNoticeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinPackageNoticeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinPackageNoticeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
