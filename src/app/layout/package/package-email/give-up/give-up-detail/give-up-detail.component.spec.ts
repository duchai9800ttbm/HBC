import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveUpDetailComponent } from './give-up-detail.component';

describe('GiveUpDetailComponent', () => {
  let component: GiveUpDetailComponent;
  let fixture: ComponentFixture<GiveUpDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiveUpDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveUpDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
