import { Component } from '@angular/core';
import { Category, CategoryService } from '../../../../core/services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-filters-bar',
  imports: [CommonModule],
  templateUrl: './search-filters-bar.html',
  styleUrl: './search-filters-bar.css',
})
export class SearchFiltersBar {
  constructor(private categoryService: CategoryService) {}

  // List of categories to display in the filter bar
  categories: Category[] = [];

  // Fetch categories on component initialization
  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.items;
      },
      error: (err) => console.error(err)
    });
  }
}
