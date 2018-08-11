import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectOverviewHistoryComponent } from './prospect-overview-history.component';

describe('ProspectOverviewHistoryComponent', () => {
  let component: ProspectOverviewHistoryComponent;
  let fixture: ComponentFixture<ProspectOverviewHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectOverviewHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectOverviewHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
