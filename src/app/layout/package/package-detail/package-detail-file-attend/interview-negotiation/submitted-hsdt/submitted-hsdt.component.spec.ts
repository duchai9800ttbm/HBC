import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedHsdtComponent } from './submitted-hsdt.component';

describe('SubmittedHsdtComponent', () => {
  let component: SubmittedHsdtComponent;
  let fixture: ComponentFixture<SubmittedHsdtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedHsdtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedHsdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
