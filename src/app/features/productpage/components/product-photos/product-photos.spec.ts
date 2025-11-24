import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPhotos } from './product-photos';

describe('ProductPhotos', () => {
  let component: ProductPhotos;
  let fixture: ComponentFixture<ProductPhotos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPhotos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPhotos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
