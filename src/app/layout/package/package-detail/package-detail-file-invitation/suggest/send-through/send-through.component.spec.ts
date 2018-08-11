import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendThroughComponent } from './send-through.component';

describe('SendThroughComponent', () => {
  let component: SendThroughComponent;
  let fixture: ComponentFixture<SendThroughComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendThroughComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendThroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
