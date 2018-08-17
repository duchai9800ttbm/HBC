import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinPackageNoticeComponent } from './win-package-notice.component';

describe('WinPackageNoticeComponent', () => {
  let component: WinPackageNoticeComponent;
  let fixture: ComponentFixture<WinPackageNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinPackageNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinPackageNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
