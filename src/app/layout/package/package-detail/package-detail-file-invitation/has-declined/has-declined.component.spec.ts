import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HasDeclinedComponent } from './has-declined.component';

describe('HasDeclinedComponent', () => {
  let component: HasDeclinedComponent;
  let fixture: ComponentFixture<HasDeclinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HasDeclinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HasDeclinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
