import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectSpecHistoryComponent } from './prospect-spec-history.component';

describe('ProspectSpecHistoryComponent', () => {
  let component: ProspectSpecHistoryComponent;
  let fixture: ComponentFixture<ProspectSpecHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectSpecHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectSpecHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
