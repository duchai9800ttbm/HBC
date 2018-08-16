import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackgeCancelComponent } from './packge-cancel.component';

describe('PackgeCancelComponent', () => {
  let component: PackgeCancelComponent;
  let fixture: ComponentFixture<PackgeCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackgeCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackgeCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
