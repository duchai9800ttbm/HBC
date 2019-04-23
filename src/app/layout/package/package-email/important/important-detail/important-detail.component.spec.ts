import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantDetailComponent } from './important-detail.component';

describe('ImportantDetailComponent', () => {
  let component: ImportantDetailComponent;
  let fixture: ComponentFixture<ImportantDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportantDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
