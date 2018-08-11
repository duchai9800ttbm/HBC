import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignAuditComponent } from './campaign-audit.component';

describe('CampaignAuditComponent', () => {
  let component: CampaignAuditComponent;
  let fixture: ComponentFixture<CampaignAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
