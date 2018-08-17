import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployNoticeComponent } from './deploy-notice.component';

describe('DeployNoticeComponent', () => {
  let component: DeployNoticeComponent;
  let fixture: ComponentFixture<DeployNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
