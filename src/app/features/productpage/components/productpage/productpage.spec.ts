import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productpage } from './productpage';

describe('Productpage', () => {
  let component: Productpage;
  let fixture: ComponentFixture<Productpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
