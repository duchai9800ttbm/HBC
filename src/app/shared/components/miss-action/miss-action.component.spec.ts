import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissActionComponent } from './miss-action.component';

describe('MissActionComponent', () => {
  let component: MissActionComponent;
  let fixture: ComponentFixture<MissActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
