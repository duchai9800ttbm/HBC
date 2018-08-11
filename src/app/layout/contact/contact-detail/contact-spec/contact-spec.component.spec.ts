import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSpecComponent } from './contact-spec.component';

describe('ContactSpecComponent', () => {
  let component: ContactSpecComponent;
  let fixture: ComponentFixture<ContactSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
