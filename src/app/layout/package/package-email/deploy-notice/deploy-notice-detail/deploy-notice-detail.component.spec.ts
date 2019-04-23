import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployNoticeDetailComponent } from './deploy-notice-detail.component';

describe('DeployNoticeDetailComponent', () => {
  let component: DeployNoticeDetailComponent;
  let fixture: ComponentFixture<DeployNoticeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployNoticeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployNoticeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
