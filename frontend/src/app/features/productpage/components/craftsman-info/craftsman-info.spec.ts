import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftsmanInfo } from './craftsman-info';

describe('CraftsmanInfo', () => {
  let component: CraftsmanInfo;
  let fixture: ComponentFixture<CraftsmanInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraftsmanInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraftsmanInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
