import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectActivityHistoryComponent } from './prospect-activity-history.component';

describe('ProspectActivityHistoryComponent', () => {
  let component: ProspectActivityHistoryComponent;
  let fixture: ComponentFixture<ProspectActivityHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectActivityHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectActivityHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
