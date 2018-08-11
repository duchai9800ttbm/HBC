import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSpecComponent } from './campaign-spec.component';

describe('CampaignSpecComponent', () => {
  let component: CampaignSpecComponent;
  let fixture: ComponentFixture<CampaignSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
