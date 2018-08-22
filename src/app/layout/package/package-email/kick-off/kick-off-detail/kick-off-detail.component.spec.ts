import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KickOffDetailComponent } from './kick-off-detail.component';

describe('KickOffDetailComponent', () => {
  let component: KickOffDetailComponent;
  let fixture: ComponentFixture<KickOffDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KickOffDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KickOffDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
