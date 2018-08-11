import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCommentComponent } from './customer-comment.component';

describe('CustomerCommentComponent', () => {
  let component: CustomerCommentComponent;
  let fixture: ComponentFixture<CustomerCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
