import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousHistoryComponent } from './anonymous-history.component';

describe('AnonymousHistoryComponent', () => {
  let component: AnonymousHistoryComponent;
  let fixture: ComponentFixture<AnonymousHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonymousHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
