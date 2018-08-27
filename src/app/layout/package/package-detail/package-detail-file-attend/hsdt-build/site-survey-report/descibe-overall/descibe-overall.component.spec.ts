import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescibeOverallComponent } from './descibe-overall.component';

describe('DescibeOverallComponent', () => {
  let component: DescibeOverallComponent;
  let fixture: ComponentFixture<DescibeOverallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescibeOverallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescibeOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
