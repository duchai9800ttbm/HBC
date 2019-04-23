import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinPackageNoticeListComponent } from './win-package-notice-list.component';

describe('WinPackageNoticeListComponent', () => {
  let component: WinPackageNoticeListComponent;
  let fixture: ComponentFixture<WinPackageNoticeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinPackageNoticeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinPackageNoticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
