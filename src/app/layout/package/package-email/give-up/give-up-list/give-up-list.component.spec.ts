import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveUpListComponent } from './give-up-list.component';

describe('GiveUpListComponent', () => {
  let component: GiveUpListComponent;
  let fixture: ComponentFixture<GiveUpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveUpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveUpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
