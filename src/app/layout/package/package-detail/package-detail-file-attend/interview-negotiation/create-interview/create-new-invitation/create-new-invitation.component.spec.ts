import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewInvitationComponent } from './create-new-invitation.component';

describe('CreateNewInvitationComponent', () => {
  let component: CreateNewInvitationComponent;
  let fixture: ComponentFixture<CreateNewInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
