import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployNoticeListComponent } from './deploy-notice-list.component';

describe('DeployNoticeListComponent', () => {
  let component: DeployNoticeListComponent;
  let fixture: ComponentFixture<DeployNoticeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployNoticeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployNoticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
