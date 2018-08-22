import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashDetailComponent } from './trash-detail.component';

describe('TrashDetailComponent', () => {
  let component: TrashDetailComponent;
  let fixture: ComponentFixture<TrashDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
