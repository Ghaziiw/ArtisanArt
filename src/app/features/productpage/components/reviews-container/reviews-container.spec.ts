import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsContainer } from './reviews-container';

describe('ReviewsContainer', () => {
  let component: ReviewsContainer;
  let fixture: ComponentFixture<ReviewsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
