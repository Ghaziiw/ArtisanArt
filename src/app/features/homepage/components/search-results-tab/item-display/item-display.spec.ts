import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDisplay } from './item-display';

describe('ItemDisplay', () => {
  let component: ItemDisplay;
  let fixture: ComponentFixture<ItemDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
