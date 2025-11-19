import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePic } from './profile-pic';

describe('ProfilePic', () => {
  let component: ProfilePic;
  let fixture: ComponentFixture<ProfilePic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
