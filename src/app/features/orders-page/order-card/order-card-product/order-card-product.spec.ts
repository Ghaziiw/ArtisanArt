import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCardProduct } from './order-card-product';

describe('OrderCardProduct', () => {
  let component: OrderCardProduct;
  let fixture: ComponentFixture<OrderCardProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCardProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCardProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
