import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBidGroupStakeHolderComponent } from './user-bid-group-stake-holder.component';

describe('UserBidGroupStakeHolderComponent', () => {
  let component: UserBidGroupStakeHolderComponent;
  let fixture: ComponentFixture<UserBidGroupStakeHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBidGroupStakeHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBidGroupStakeHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
