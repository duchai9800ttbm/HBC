import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleOverallComponent } from './scale-overall.component';

describe('ScaleOverallComponent', () => {
  let component: ScaleOverallComponent;
  let fixture: ComponentFixture<ScaleOverallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScaleOverallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
