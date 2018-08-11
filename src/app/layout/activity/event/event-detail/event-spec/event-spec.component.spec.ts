import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSpecComponent } from './event-spec.component';

describe('EventSpecComponent', () => {
  let component: EventSpecComponent;
  let fixture: ComponentFixture<EventSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
