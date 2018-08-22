import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissPackageNoticeListComponent } from './miss-package-notice-list.component';

describe('MissPackageNoticeListComponent', () => {
  let component: MissPackageNoticeListComponent;
  let fixture: ComponentFixture<MissPackageNoticeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissPackageNoticeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissPackageNoticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
