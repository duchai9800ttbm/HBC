import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityCommentComponent } from './opportunity-comment.component';

describe('OpportunityCommentComponent', () => {
  let component: OpportunityCommentComponent;
  let fixture: ComponentFixture<OpportunityCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
