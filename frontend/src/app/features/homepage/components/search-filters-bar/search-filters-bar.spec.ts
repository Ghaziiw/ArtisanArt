import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFiltersBar } from './search-filters-bar';

describe('SearchFiltersBar', () => {
  let component: SearchFiltersBar;
  let fixture: ComponentFixture<SearchFiltersBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFiltersBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFiltersBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
