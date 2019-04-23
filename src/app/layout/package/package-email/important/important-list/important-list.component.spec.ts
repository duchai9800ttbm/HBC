import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantListComponent } from './important-list.component';

describe('ImportantListComponent', () => {
  let component: ImportantListComponent;
  let fixture: ComponentFixture<ImportantListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportantListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
