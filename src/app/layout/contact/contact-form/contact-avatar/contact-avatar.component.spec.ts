import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAvatarComponent } from './contact-avatar.component';

describe('ContactAvatarComponent', () => {
  let component: ContactAvatarComponent;
  let fixture: ComponentFixture<ContactAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
