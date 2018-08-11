import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCommentComponent } from './contact-comment.component';

describe('ContactCommentComponent', () => {
  let component: ContactCommentComponent;
  let fixture: ComponentFixture<ContactCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
