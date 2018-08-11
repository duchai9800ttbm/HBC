import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertProspectModalComponent } from './convert-prospect-modal.component';

describe('ConvertProspectModalComponent', () => {
  let component: ConvertProspectModalComponent;
  let fixture: ComponentFixture<ConvertProspectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertProspectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertProspectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
