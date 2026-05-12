import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCtrlPage } from './admin-ctrl-page';

describe('AdminCtrlPage', () => {
  let component: AdminCtrlPage;
  let fixture: ComponentFixture<AdminCtrlPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCtrlPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCtrlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
