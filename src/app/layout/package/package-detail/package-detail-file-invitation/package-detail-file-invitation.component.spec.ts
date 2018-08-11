import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailFileInvitationComponent } from './package-detail-file-invitation.component';

describe('PackageDetailFileInvitaionComponent', () => {
  let component: PackageDetailFileInvitationComponent;
  let fixture: ComponentFixture<PackageDetailFileInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDetailFileInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDetailFileInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
