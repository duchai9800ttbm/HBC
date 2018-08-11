import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectMenuHistoryComponent } from './prospect-menu-history.component';

describe('ProspectMenuHistoryComponent', () => {
  let component: ProspectMenuHistoryComponent;
  let fixture: ComponentFixture<ProspectMenuHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectMenuHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectMenuHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
