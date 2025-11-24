import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartBtn } from './shopping-cart-btn';

describe('ShoppingCartBtn', () => {
  let component: ShoppingCartBtn;
  let fixture: ComponentFixture<ShoppingCartBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCartBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
