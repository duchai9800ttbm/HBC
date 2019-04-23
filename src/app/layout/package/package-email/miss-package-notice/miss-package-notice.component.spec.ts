import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissPackageNoticeComponent } from './miss-package-notice.component';

describe('MissPackageNoticeComponent', () => {
  let component: MissPackageNoticeComponent;
  let fixture: ComponentFixture<MissPackageNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissPackageNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissPackageNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
