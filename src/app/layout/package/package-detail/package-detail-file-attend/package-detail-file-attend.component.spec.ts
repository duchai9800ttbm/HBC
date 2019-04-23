import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailFileAttendComponent } from './package-detail-file-attend.component';

describe('PackageDetailFileAttendComponent', () => {
  let component: PackageDetailFileAttendComponent;
  let fixture: ComponentFixture<PackageDetailFileAttendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDetailFileAttendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDetailFileAttendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
