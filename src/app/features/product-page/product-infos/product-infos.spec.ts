import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInfos } from './product-infos';

describe('ProductInfos', () => {
  let component: ProductInfos;
  let fixture: ComponentFixture<ProductInfos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInfos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductInfos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
