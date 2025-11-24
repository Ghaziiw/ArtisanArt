import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartProductCard } from './cart-product-card';

describe('CartProductCard', () => {
  let component: CartProductCard;
  let fixture: ComponentFixture<CartProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartProductCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartProductCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
