import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingExplore } from './following-explore';

describe('FollowingExplore', () => {
  let component: FollowingExplore;
  let fixture: ComponentFixture<FollowingExplore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowingExplore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowingExplore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
