import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KickOffComponent } from './kick-off.component';

describe('KickOffComponent', () => {
  let component: KickOffComponent;
  let fixture: ComponentFixture<KickOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KickOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KickOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
