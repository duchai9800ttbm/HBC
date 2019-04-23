import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetActiveCodeComponent } from './get-active-code.component';

describe('GetActiveCodeComponent', () => {
  let component: GetActiveCodeComponent;
  let fixture: ComponentFixture<GetActiveCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetActiveCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetActiveCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
