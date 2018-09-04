import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoConsoComponent } from './demo-conso.component';

describe('DemoConsoComponent', () => {
  let component: DemoConsoComponent;
  let fixture: ComponentFixture<DemoConsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoConsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
