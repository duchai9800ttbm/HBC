import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingKickoffComponent } from './meeting-kickoff.component';

describe('MeetingKickoffComponent', () => {
  let component: MeetingKickoffComponent;
  let fixture: ComponentFixture<MeetingKickoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingKickoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingKickoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
