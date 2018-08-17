import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveUpComponent } from './give-up.component';

describe('GiveUpComponent', () => {
  let component: GiveUpComponent;
  let fixture: ComponentFixture<GiveUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
