import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectCommentHistoryComponent } from './prospect-comment-history.component';

describe('ProspectCommentHistoryComponent', () => {
  let component: ProspectCommentHistoryComponent;
  let fixture: ComponentFixture<ProspectCommentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectCommentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectCommentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
