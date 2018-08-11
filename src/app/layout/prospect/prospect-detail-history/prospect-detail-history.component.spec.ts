import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectDetailHistoryComponent } from './prospect-detail-history.component';

describe('ProspectDetailHistoryComponent', () => {
  let component: ProspectDetailHistoryComponent;
  let fixture: ComponentFixture<ProspectDetailHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectDetailHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectDetailHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
