import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsTab } from './search-results-tab';

describe('SearchResultsTab', () => {
  let component: SearchResultsTab;
  let fixture: ComponentFixture<SearchResultsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
